# collectors/queries.py

CAMPAIGNS_QUERY = """
    SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros
    FROM campaign
    WHERE segments.date DURING LAST_30_DAYS
"""

AD_GROUPS_QUERY = """
    SELECT
        campaign.id,
        campaign.name,
        ad_group.id,
        ad_group.name,
        ad_group.status
    FROM ad_group
    WHERE campaign.status = 'ENABLED' AND ad_group.status = 'ENABLED'
"""

# GAQL query for RSA assets details and performance
RSA_ASSETS_QUERY = """
    SELECT
        campaign.name,
        ad_group.name,
        ad_group_ad_asset_view.field_type,
        ad_group_ad_asset_view.performance_label,
        ad_group_ad_asset_view.pinned_field,
        asset.text_asset.text,
        metrics.impressions,
        metrics.clicks
    FROM ad_group_ad_asset_view
    WHERE campaign.status = 'ENABLED'
      AND ad_group.status = 'ENABLED'
      AND segments.date DURING LAST_30_DAYS
"""

SEARCH_TERMS_QUERY = """
    SELECT
        campaign.name,
        ad_group.name,
        search_term_view.search_term,
        search_term_view.status,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros
    FROM search_term_view
    WHERE segments.date DURING LAST_7_DAYS
"""
