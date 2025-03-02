from __future__ import absolute_import

import six

from collections import Iterable
from django.utils import timezone
from django.db.models import Q

from sentry import analytics
from sentry.coreapi import APIError
from sentry.constants import SentryAppStatus
from sentry.mediators import Mediator, Param
from sentry.mediators import service_hooks
from sentry.mediators.param import if_param
from sentry.models import SentryAppComponent, ServiceHook, SentryAppInstallation, ApiToken
from sentry.models.sentryapp import REQUIRED_EVENT_PERMISSIONS


class Updater(Mediator):
    sentry_app = Param("sentry.models.SentryApp")
    name = Param(six.string_types, required=False)
    status = Param(six.string_types, required=False)
    scopes = Param(Iterable, required=False)
    events = Param(Iterable, required=False)
    webhook_url = Param(six.string_types, required=False)
    redirect_url = Param(six.string_types, required=False)
    is_alertable = Param(bool, required=False)
    verify_install = Param(bool, required=False)
    schema = Param(dict, required=False)
    overview = Param(six.string_types, required=False)
    user = Param("sentry.models.User")

    def call(self):
        self._update_name()
        self._update_author()
        self._update_status()
        self._update_scopes()
        self._update_events()
        self._update_webhook_url()
        self._update_redirect_url()
        self._update_is_alertable()
        self._update_verify_install()
        self._update_overview()
        self._update_schema()
        self._update_service_hooks()
        self.sentry_app.save()
        return self.sentry_app

    @if_param("name")
    def _update_name(self):
        self.sentry_app.name = self.name

    @if_param("author")
    def _update_author(self):
        self.sentry_app.author = self.author

    @if_param("status")
    def _update_status(self):
        if self.user.is_superuser:
            if self.status == SentryAppStatus.PUBLISHED_STR:
                self.sentry_app.status = SentryAppStatus.PUBLISHED
            if self.status == SentryAppStatus.UNPUBLISHED_STR:
                self.sentry_app.status = SentryAppStatus.UNPUBLISHED

    @if_param("scopes")
    def _update_scopes(self):
        if (
            self.sentry_app.status == SentryAppStatus.PUBLISHED
            and self.sentry_app.scope_list != self.scopes
        ):
            raise APIError("Cannot update permissions on a published integration.")
        self.sentry_app.scope_list = self.scopes
        # update the scopes of active tokens tokens
        ApiToken.objects.filter(
            Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now()),
            application=self.sentry_app.application,
        ).update(scope_list=list(self.scopes))

    @if_param("events")
    def _update_events(self):
        for event in self.events:
            needed_scope = REQUIRED_EVENT_PERMISSIONS[event]
            if needed_scope not in self.sentry_app.scope_list:
                raise APIError(
                    u"{} webhooks require the {} permission.".format(event, needed_scope)
                )

        from sentry.mediators.service_hooks.creator import expand_events

        self.sentry_app.events = expand_events(self.events)

    def _update_service_hooks(self):
        hooks = ServiceHook.objects.filter(application=self.sentry_app.application)
        # sentry_app.webhook_url will be updated at this point
        webhook_url = self.sentry_app.webhook_url
        for hook in hooks:
            # update the url and events
            if webhook_url:
                service_hooks.Updater.run(
                    service_hook=hook, events=self.sentry_app.events, url=webhook_url
                )
            # if no url, then the service hook is no longer active in which case we need to delete it
            else:
                service_hooks.Destroyer.run(service_hook=hook)
        # if we don't have hooks but we have a webhook url now, need to create it for an internal integration
        if webhook_url and self.sentry_app.is_internal and not hooks:
            installation = SentryAppInstallation.objects.get(sentry_app_id=self.sentry_app.id)
            service_hooks.Creator.run(
                application=self.sentry_app.application,
                actor=installation,
                projects=[],
                organization=self.sentry_app.owner,
                events=self.sentry_app.events,
                url=webhook_url,
            )

    @if_param("webhook_url")
    def _update_webhook_url(self):
        self.sentry_app.webhook_url = self.webhook_url

    @if_param("redirect_url")
    def _update_redirect_url(self):
        self.sentry_app.redirect_url = self.redirect_url

    @if_param("is_alertable")
    def _update_is_alertable(self):
        self.sentry_app.is_alertable = self.is_alertable

    @if_param("verify_install")
    def _update_verify_install(self):
        if self.sentry_app.is_internal and self.verify_install:
            raise APIError(u"Internal integrations cannot have verify_install=True.")
        self.sentry_app.verify_install = self.verify_install

    @if_param("overview")
    def _update_overview(self):
        self.sentry_app.overview = self.overview

    @if_param("schema")
    def _update_schema(self):
        self.sentry_app.schema = self.schema
        self._delete_old_ui_components()
        self._create_ui_components()

    def _delete_old_ui_components(self):
        SentryAppComponent.objects.filter(sentry_app_id=self.sentry_app.id).delete()

    def _create_ui_components(self):
        for element in self.schema.get("elements", []):
            SentryAppComponent.objects.create(
                type=element["type"], sentry_app_id=self.sentry_app.id, schema=element
            )

    def record_analytics(self):
        analytics.record(
            "sentry_app.updated", user_id=self.user.id, sentry_app=self.sentry_app.slug
        )
