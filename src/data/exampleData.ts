import { Service } from '@/types/service';

export const exampleData: Service[] = [
  {
    "team": 187,
    "type": "frontend",
    "reposiory": "frontend-template",
    "connetions": [
      {
        "method": "GET",
        "url": "/brightsky/weather",
        "description": "Fetch current weather data",
        "file": "src/pages/Weather/Weather.tsx",
        "line": 14,
        "confidence": "high",
        "team": 12,
        "service_name": "Weather Service"
      },
      {
        "method": "POST",
        "url": "/api/user/profile",
        "description": "Update user profile",
        "file": "src/pages/Profile/Profile.tsx",
        "line": 23,
        "confidence": "high",
        "team": 45,
        "service_name": "User Service"
      }
    ]
  },
  {
    "team": 12,
    "type": "backend",
    "reposiory": "weather-service",
    "connetions": [
      {
        "method": "GET",
        "url": "/external/brightsky",
        "description": "Fetch from external API",
        "file": "src/controllers/weather.ts",
        "line": 8,
        "confidence": "medium",
        "team": 99,
        "service_name": "External API"
      }
    ]
  },
  {
    "team": 45,
    "type": "backend",
    "reposiory": "user-service",
    "connetions": [
      {
        "method": "GET",
        "url": "/database/users",
        "description": "Query user database",
        "file": "src/database/users.ts",
        "line": 45,
        "confidence": "high",
        "team": 78,
        "service_name": "Database Service"
      }
    ]
  },
  {
    "team": 78,
    "type": "backend",
    "reposiory": "database-service",
    "connetions": []
  },
  {
    "team": 99,
    "type": null,
    "reposiory": "external-api-gateway",
    "connetions": []
  },
  {
    "team": 101,
    "type": "frontend",
    "reposiory": "admin-dashboard",
    "connetions": [
      {
        "method": "GET",
        "url": "/api/analytics",
        "description": "Fetch analytics data",
        "file": "src/pages/Dashboard.tsx",
        "line": 67,
        "confidence": "high",
        "team": 102,
        "service_name": "Analytics Service"
      },
      {
        "method": "GET",
        "url": "/api/user/list",
        "description": "Get all users",
        "file": "src/pages/Users.tsx",
        "line": 12,
        "confidence": "high",
        "team": 45,
        "service_name": "User Service"
      }
    ]
  },
  {
    "team": 102,
    "type": "backend",
    "reposiory": "analytics-service",
    "connetions": [
      {
        "method": "GET",
        "url": "/database/events",
        "description": "Query events data",
        "file": "src/services/analytics.ts",
        "line": 34,
        "confidence": "high",
        "team": 78,
        "service_name": "Database Service"
      }
    ]
  }
];
