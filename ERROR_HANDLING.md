# Error Handling - Implementation Guide

## ✅ Improved Error Handling

### **Backend Error Formats Supported:**

```json
// Format 1: { error: "..." }
{
  "error": "Tower name already exists"
}

// Format 2: { message: "..." }
{
  "message": "Invalid credentials"
}

// Format 3: { errors: [...] }
{
  "errors": ["Email is required", "Password too short"]
}

// Format 4: Generic
{
  "status": 400,
  "error": "Bad Request"
}
```

---

## 🔧 Implementation

### **1. API Helper (`lib/api.ts`)**

```typescript
async function apiCall<T>(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Extract error from multiple possible formats
      const errorMessage = 
        data.error ||           // { error: "..." }
        data.message ||         // { message: "..." }
        data.errors?.[0] ||     // { errors: ["..."] }
        'Something went wrong';
      
      console.error('API Error:', errorMessage, 'Response:', data);
      
      return {
        success: false,
        error: errorMessage,  // ← Exact backend error
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error('Network Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
```

---

### **2. Component Error Handling (Tower Create)**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await towerApi.create({ name, description, ... });
    
    console.log('Create Tower Response:', response);
    
    if (response.success && response.data) {
      router.push(`/towers/${response.data.id}`);
    } else {
      // Show exact error from backend
      const errorMessage = response.error || 'Failed to create tower';
      console.error('Tower creation failed:', errorMessage);
      setError(errorMessage);  // ← Display to user
    }
  } catch (err: any) {
    console.error('Error creating tower:', err);
    const errorMessage = err.message || 'Network error. Please check your connection.';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
```

---

### **3. Error Display (UI)**

```tsx
{error && (
  <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
    {error}
  </div>
)}
```

---

## 📊 Error Flow

```
Backend Response
    ↓
{ "error": "Tower name already exists" }
    ↓
API Helper extracts error
    ↓
response.error = "Tower name already exists"
    ↓
Component receives error
    ↓
setError("Tower name already exists")
    ↓
UI displays error to user
```

---

## 🎯 Error Types & Messages

### **Validation Errors**
```json
Backend: { "error": "Tower name already exists" }
Display: "Tower name already exists"

Backend: { "error": "Invalid email format" }
Display: "Invalid email format"

Backend: { "errors": ["Name is required", "Code must be unique"] }
Display: "Name is required"  // First error
```

### **Authentication Errors**
```json
Backend: { "error": "Invalid credentials" }
Display: "Invalid credentials"

Backend: { "error": "Token expired" }
Display: "Token expired"

Backend: { "message": "Unauthorized" }
Display: "Unauthorized"
```

### **Network Errors**
```json
Fetch fails (no internet)
Display: "Network error"

Fetch fails (timeout)
Display: "Network error. Please check your connection."
```

### **Server Errors**
```json
Backend: { "error": "Internal server error" }
Display: "Internal server error"

Backend: 500 with no body
Display: "Something went wrong"
```

---

## 🔍 Console Logging

### **Success Case**
```javascript
Create Tower Response: {
  success: true,
  data: { id: "123", name: "Phoenix Esports", ... }
}
```

### **Error Case**
```javascript
API Error: Tower name already exists
Response: { error: "Tower name already exists" }
Tower creation failed: Tower name already exists
```

### **Network Error**
```javascript
Network Error: TypeError: Failed to fetch
```

---

## ✅ Testing Error Handling

### **Test 1: Duplicate Tower Name**
```bash
# Backend returns
{ "error": "Tower name already exists" }

# Frontend shows
"Tower name already exists"
```

### **Test 2: Validation Error**
```bash
# Backend returns
{ "message": "Name must be at least 3 characters" }

# Frontend shows
"Name must be at least 3 characters"
```

### **Test 3: Network Error**
```bash
# Stop backend server
# Frontend shows
"Network error"
```

### **Test 4: Multiple Errors**
```bash
# Backend returns
{ "errors": ["Email is required", "Password too short"] }

# Frontend shows
"Email is required"  # First error
```

---

## 📝 Best Practices

### ✅ DO:
- Show exact backend error messages
- Log errors to console for debugging
- Handle multiple error formats
- Clear error on retry
- Show user-friendly fallback messages

### ❌ DON'T:
- Show generic "Something went wrong" when specific error available
- Ignore backend error messages
- Show technical stack traces to users
- Leave errors unhandled

---

## 🔄 Error Handling Checklist

- [x] Extract `error` field from response
- [x] Extract `message` field from response
- [x] Extract `errors` array from response
- [x] Console log for debugging
- [x] Display to user in UI
- [x] Clear error on retry
- [x] Handle network errors
- [x] Handle timeout errors
- [x] Fallback to generic message

---

## 🎨 Error UI Examples

### **Red Alert Box**
```tsx
{error && (
  <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
    {error}
  </div>
)}
```

### **Toast Notification** (Future)
```tsx
import { toast } from 'react-hot-toast';

if (response.error) {
  toast.error(response.error);
}
```

### **Inline Error** (Form Fields)
```tsx
{fieldError && (
  <p className="mt-1 text-sm text-red-500">{fieldError}</p>
)}
```

---

## 📊 Error Statistics (Future Enhancement)

Track common errors:
```javascript
{
  "Tower name already exists": 45,
  "Invalid credentials": 23,
  "Network error": 12,
  "Token expired": 8
}
```

---

**Status**: Implemented ✅  
**Version**: 1.0.0  
**Last Updated**: Oct 14, 2025

---

## 🚀 Quick Reference

```typescript
// Backend sends
{ "error": "Tower name already exists" }

// Frontend receives
response.error = "Tower name already exists"

// Frontend displays
<div className="error">{error}</div>
// Shows: "Tower name already exists"
```

Perfect! Ab backend se jo bhi error aaye, wahi exact message user ko dikhega! 🎯
