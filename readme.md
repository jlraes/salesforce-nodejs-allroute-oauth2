# Salesforce OAuth 2.0 Simple Route-All

This is a node.js script that uses the passport-salesforce-oauth2 strategy to verify a login on Salesforce.  This creates a cookie with some basic information in it; then uses the organization_id to verify that the person should have access to the rest of your script.

The script is configured in a way that routes everything automatically.

