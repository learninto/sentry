from __future__ import absolute_import

from datetime import timedelta

import six
from enum import Enum
from rest_framework import serializers

from sentry.api.serializers.rest_framework.base import CamelSnakeModelSerializer
from sentry.incidents.models import AlertRule, AlertRuleThresholdType
from sentry.snuba.models import QueryAggregations
from sentry.incidents.logic import (
    AlertRuleNameAlreadyUsedError,
    create_alert_rule,
    update_alert_rule,
)


class AlertRuleSerializer(CamelSnakeModelSerializer):
    # XXX: ArrayFields aren't supported automatically until DRF 3.1
    aggregations = serializers.ListField(child=serializers.IntegerField(), required=False)

    class Meta:
        model = AlertRule
        fields = [
            "name",
            "threshold_type",
            "query",
            "time_window",
            "alert_threshold",
            "resolve_threshold",
            "threshold_period",
            "aggregation",
            "aggregations",
        ]
        extra_kwargs = {
            "query": {"allow_blank": True, "required": True},
            "threshold_period": {"default": 1, "min_value": 1, "max_value": 20},
            "alert_threshold": {"required": True},
            "resolve_threshold": {"required": True},
            "time_window": {
                "min_value": 1,
                "max_value": int(timedelta(days=1).total_seconds() / 60),
                "required": True,
            },
            "aggregation": {"required": False},
            "name": {"min_length": 1, "max_length": 64},
        }

    def validate_threshold_type(self, threshold_type):
        try:
            return AlertRuleThresholdType(threshold_type)
        except ValueError:
            raise serializers.ValidationError(
                "Invalid threshold type, valid values are %s"
                % [item.value for item in AlertRuleThresholdType]
            )

    def validate_aggregation(self, aggregation):
        try:
            return QueryAggregations(aggregation)
        except ValueError:
            raise serializers.ValidationError(
                "Invalid aggregation, valid values are %s"
                % [item.value for item in QueryAggregations]
            )

    def validate_aggregations(self, aggregations):
        # TODO: Remove this once FE transitions
        try:
            return [QueryAggregations(agg) for agg in aggregations]
        except ValueError:
            raise serializers.ValidationError(
                "Invalid aggregation, valid values are %s"
                % [item.value for item in QueryAggregations]
            )

    def validate(self, attrs):
        return self._handle_aggregations_transition(attrs)

    def create(self, validated_data):
        try:
            # TODO: Remove this, just temporary while we're supporting both fields.
            if "aggregation" not in validated_data:
                raise serializers.ValidationError("aggregation is required")

            return create_alert_rule(project=self.context["project"], **validated_data)
        except AlertRuleNameAlreadyUsedError:
            raise serializers.ValidationError("This name is already in use for this project")

    def _remove_unchanged_fields(self, instance, validated_data):
        for field_name, value in list(six.iteritems(validated_data)):
            # Remove any fields that haven't actually changed
            if isinstance(value, Enum):
                value = value.value
            elif field_name == "aggregations":
                value = [item.value for item in value]
            if getattr(instance, field_name) == value:
                validated_data.pop(field_name)
        return validated_data

    def _handle_aggregations_transition(self, validated_data):
        # Temporary methods for transitioning from multiple aggregations to a single
        # aggregate
        if "aggregations" in validated_data and "aggregation" not in validated_data:
            validated_data["aggregation"] = validated_data["aggregations"][0]

        validated_data.pop("aggregations", None)
        return validated_data

    def update(self, instance, validated_data):
        validated_data = self._remove_unchanged_fields(instance, validated_data)
        return update_alert_rule(instance, **validated_data)
