# Claude Integration - Weather-Man Project

This directory contains the Claude AI integration components for the Weather-Man project. These modules use the Anthropic Claude API to provide smart agricultural insights and decision support based on environmental sensor data.

## Overview

The Claude integration provides two main functionalities:

1. **Crop Recommentation Generation** - Detailed Crop recommendations based on environmental conditions
2. **Automated Decision Support** - Simple action recommendations for IoT automation

## Files

- **getCropRecommentation** - Generates detailed HTML-formatted crop recommendation based on environmental data
- **takeIoTAction** - Makes simple action decisions for automated systems
- **fetchNews** - Fetches relevant news articles for context
- **fetchWeather** - Fetches current weather data for context
- **prompts** - Contains prompt templates for Claude API calls

## Setup Requirements

1. An Anthropic API key is required and should be set in the environment variables
2. Configure location in environment variables (optional, defaults to "Sri Lanka")

## Environment Variables

| Variable            | Description                            | Default                   |
| ------------------- | -------------------------------------- | ------------------------- |
| `ANTHROPIC_API_KEY` | Your Anthropic API key                 | Required                  |
| `ANTHROPIC_MODEL`   | Anthiropic model to use                | 'claude-3-haiku-20240307' |
| `LOCATION`          | Default location for contextual advice | 'Sri Lanka'               |

## Claude Models

- `getFarmingAdvice` uses: `claude-3-haiku-20240307` (default)
- `takeIoTAction` uses: `claude-3-haiku-20240307` (default)

### NOTE: Ensure you have access to the specified Claude models in your Anthropic account
