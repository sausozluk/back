define({ "api": [
  {
    "type": "Post",
    "url": "/sessions/check",
    "title": "Session Check",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "Check",
    "group": "Auth",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "SessionExist-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"isAlive\": true,\n    \"user_id\": \"\",\n    \"slug\": \"\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "SessionNotExist-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"isAlive\": false\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "Post",
    "url": "/sessions",
    "title": "Login",
    "name": "Login",
    "group": "Auth",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "UserNotFound-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": false,\n  \"message\": \"yanlış e-posta/şifre\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    user_id: \"\",\n    token: \"\",\n    email: \"\",\n    username: \"\",\n    slug: \"\",\n    authority: \"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "Delete",
    "url": "/sessions",
    "title": "Logout",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "Logout",
    "group": "Auth",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  success: true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "Post",
    "url": "/users",
    "title": "Register",
    "name": "Register",
    "group": "Auth",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "AlreadyRegistered-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": false,\n  \"message\": \"böyle birisi var ama\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    user_id: \"\",\n    token: \"\",\n    email: \"\",\n    username: \"\",\n    slug: \"\",\n    authority: \"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "Post",
    "url": "/chats",
    "title": "Create Chat",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "Create",
    "group": "Chat",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "users",
            "description": "<p>user slug list</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": false,\n  \"message\": \"kavuşamazsınız\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    chat: \"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/chat.js",
    "groupTitle": "Chat"
  },
  {
    "type": "Get",
    "url": "/chats/:slug",
    "title": "Get Single Chat",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "GetSingleChat",
    "group": "Chat",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": [Message]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/chat.js",
    "groupTitle": "Chat"
  },
  {
    "type": "Get",
    "url": "/chats",
    "title": "Inbox",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "Inbox",
    "group": "Chat",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": [Chat]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/chat.js",
    "groupTitle": "Chat"
  },
  {
    "type": "Post",
    "url": "/chats/send",
    "title": "Send Message",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "Send",
    "group": "Chat",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "to",
            "description": "<p>to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>message</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": false\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/chat.js",
    "groupTitle": "Chat"
  },
  {
    "type": "post",
    "url": "/entries",
    "title": "Create Entry",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "CreateEntry",
    "group": "Entry",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "topic_id",
            "description": "<p>topic id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>text</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"id\": \"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/entry.js",
    "groupTitle": "Entry"
  },
  {
    "type": "post",
    "url": "/entry/vote/down",
    "title": "Give Down Vote For Entry",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "DownVoteEntry",
    "group": "Entry",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"upvotes_count\": 0...n,\n    \"downvotes_count\": 0...n\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/entry.js",
    "groupTitle": "Entry"
  },
  {
    "type": "get",
    "url": "/entries/:id",
    "title": "Get Entry",
    "name": "GetEntry",
    "group": "Entry",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"id\": \"\",\n    \"text\": \"\",\n    \"upvotes_count\": 0...n,\n    \"downvotes_count\": 0...n,\n    \"created_at\": \"\",\n    \"updated_at\": \"\",\n    \"user\": {\n      \"id\": \"\",\n      \"username\": \"\",\n      \"slug\": \"\"\n    },\n    \"topic\": {\n      \"id\": \"\",\n      \"title\": \"\",\n      \"slug\": \"\",\n      \"created_at\": \"\",\n      \"updated_at\": \"\"\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/entry.js",
    "groupTitle": "Entry"
  },
  {
    "type": "delete",
    "url": "/entries/:id",
    "title": "Remove Entry With Id",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "RemoveEntry",
    "group": "Entry",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/entry.js",
    "groupTitle": "Entry"
  },
  {
    "type": "post",
    "url": "/entry/vote/up",
    "title": "Give Up Vote For Entry",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "UpVoteEntry",
    "group": "Entry",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"upvotes_count\": 0...n,\n    \"downvotes_count\": 0...n\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/entry.js",
    "groupTitle": "Entry"
  },
  {
    "type": "put",
    "url": "/entries/:id",
    "title": "Update Entry",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "UpdateEntry",
    "group": "Entry",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>text</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/entry.js",
    "groupTitle": "Entry"
  },
  {
    "type": "get",
    "url": "/",
    "title": "Index",
    "name": "index",
    "group": "Home",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/home.js",
    "groupTitle": "Home"
  },
  {
    "type": "get",
    "url": "/online",
    "title": "Online",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "online",
    "group": "Home",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"online\": []\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/home.js",
    "groupTitle": "Home"
  },
  {
    "type": "get",
    "url": "/status",
    "title": "Status",
    "name": "status",
    "group": "Home",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"version\": \"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/home.js",
    "groupTitle": "Home"
  },
  {
    "type": "get",
    "url": "/search?q=:query",
    "title": "Search User and Topic with Query",
    "name": "Search",
    "group": "Search",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query",
            "description": "<p>query</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"users\": [{\n      \"username\": \"\",\n      \"slug\": \"\"\n    }],\n    \"topics\": [{\n      \"id\": \"\",\n      \"title\": \"\",\n      \"slug\": \"\"\n    }]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "get",
    "url": "/search/user?q=:query",
    "title": "Search User with Query",
    "name": "SearchUser",
    "group": "Search",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query",
            "description": "<p>query</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": [{\n    \"username\": \"\",\n    \"slug\": \"\"\n  }]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/search.js",
    "groupTitle": "Search"
  },
  {
    "type": "post",
    "url": "/topics",
    "title": "Create Topic",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Users unique access-key.</p>"
          }
        ]
      }
    },
    "name": "CreateTopic",
    "group": "Topic",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data.entry",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.entry.text",
            "description": "<p>text</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data.topic",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.topic.title",
            "description": "<p>title</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"entry_id\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/topic.js",
    "groupTitle": "Topic"
  },
  {
    "type": "get",
    "url": "/topics/i/random",
    "title": "Get Random 5 Topic",
    "name": "GetRandomTopics",
    "group": "Topic",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": [\n    \"entry\": {\n      \"id\": \"\",\n      \"user\": {\n        \"id\": \"\",\n        \"slug\": \"\",\n        \"username\": \"\"\n      },\n      \"text\": \"\",\n      \"upvotes_count\": 0...n,\n      \"downvotes_count\": 0...n,\n      \"created_at\": \"\",\n      \"updated_at\": \"\"\n    },\n    \"topic\": {\n      \"id\": \"\",\n      \"slug\": \"\",\n      \"title\": \"\"\n    },\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/topic.js",
    "groupTitle": "Topic"
  },
  {
    "type": "post",
    "url": "/topics/:id?page=:page",
    "title": "Get Topic",
    "name": "GetTopic",
    "group": "Topic",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "page",
            "description": "<p>page (Optional)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"title\": \"\",\n    \"slug\": \"\",\n    \"entries\": [{\n      \"id\": \"\",\n      \"user\": {\n        \"id\": \"\",\n        \"slug\": \"\",\n        \"username\": \"\"\n      },\n      \"text\": \"\",\n      \"upvotes_count\": 0...n,\n      \"downvotes_count\": 0...n,\n      \"created_at\": \"\",\n      \"updated_at\": \"\"\n    }],\n    \"total_page\": 0...n\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/topic.js",
    "groupTitle": "Topic"
  },
  {
    "type": "post",
    "url": "/topics?count=:count&timestamp:timestamp",
    "title": "Get Topics",
    "name": "GetTopics",
    "group": "Topic",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "count",
            "description": "<p>count (Optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "timestamp",
            "description": "<p>timestamp (Optional)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"entries_count\": 0...n,\n    \"topics\": [{\n      \"id\": \"\",\n      \"title\": \"\",\n      \"slug\": \"\",\n      \"count\": 0...n,\n      \"created_at\": \"\",\n      \"updated_at\": \"\"\n    }],\n    \"topics_count\": 0...n\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/topic.js",
    "groupTitle": "Topic"
  },
  {
    "type": "get",
    "url": "/users/profile/:slug",
    "title": "Get Profile With Slug",
    "name": "GetProfile",
    "group": "User",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "slug",
            "description": "<p>slug</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"username\": \"\",\n    \"last_entries\": [{\n      \"id\": \"\",\n      \"title\": \"\"\n    }],\n    \"most_liked\": [{\n      \"id\": \"\",\n      \"title\": \"\"\n    }],\n    \"liked\": [{\n      \"id\": \"\",\n      \"title\": \"\"\n    }]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/user.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:slug",
    "title": "Get User With Slug",
    "name": "GetUser",
    "group": "User",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "slug",
            "description": "<p>slug</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200\n{\n  \"success\": true,\n  \"data\": {\n    \"username\": \"\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/libs/routers/user.js",
    "groupTitle": "User"
  }
] });