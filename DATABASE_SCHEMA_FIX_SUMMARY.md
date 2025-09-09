# Database Schema Fix Summary

## Problem Identified

The console was showing errors:
```
❌ Teacher profile fetch error: {
  code: '42703',
  details: null,
  hint: null,
  message: 'column teachers.user_id does not exist'
}

Error fetching student profile with service role: {
  code: '42703',
  details: null,
  hint: null,
  message: 'column students.user_id does not exist'
}
```

## Root Cause

The API routes were trying to query for `user_id` columns in the `teachers` and `students` tables, but these tables were using `id` as the primary key that references `auth.users(id)`.

## Solution Applied

### 1. Updated API Routes
**Files Modified:**
- `app/api/teacher-profile/route.ts`
- `app/api/student-profile/route.ts`

**Changes:**
- Changed from `query.or(\`user_id.eq.${userId},id.eq.${userId}\`)` 
- To: `query.eq('id', userId)`

This uses the existing `id` column which already references `auth.users(id)`.

### 2. Database Schema Fix (Optional)
**File Created:** `database/fix_user_id_columns.sql`

This script adds `user_id` columns to both tables if needed, but the API fix above should resolve the immediate issue.

## Files Created for Testing

1. **`app/api-test/page.tsx`** - Test page to verify API endpoints work correctly
2. **`database/fix_user_id_columns.sql`** - Database schema fix (if needed)

## How to Test the Fix

### Step 1: Test API Endpoints
1. Go to `/api-test` to run automated tests
2. Check if teacher and student profile APIs work correctly

### Step 2: Test Profile Creation
1. Go to `/complete-profile?type=student`
2. Try to create a student profile
3. Check if the error is resolved

### Step 3: Check Console
1. Open browser developer tools
2. Look for the previous error messages
3. They should no longer appear

## Expected Results

After the fix:
- ✅ Teacher profile API should work without errors
- ✅ Student profile API should work without errors
- ✅ Profile creation should work correctly
- ✅ No more "column does not exist" errors in console

## Technical Details

### Database Structure
- `teachers.id` → references `auth.users(id)`
- `students.id` → references `auth.users(id)`
- Both tables use `id` as the primary key, not `user_id`

### API Query Pattern
```typescript
// Before (causing error)
query.or(`user_id.eq.${userId},id.eq.${userId}`)

// After (working)
query.eq('id', userId)
```

## Troubleshooting

If the issue persists:

1. **Check Database Connection**: Ensure Supabase is properly configured
2. **Check Table Structure**: Verify tables exist and have correct columns
3. **Check RLS Policies**: Ensure Row Level Security policies allow access
4. **Check Environment Variables**: Verify `SUPABASE_SERVICE_ROLE_KEY` is set

## Related Files

- `app/api/teacher-profile/route.ts` - Teacher profile API
- `app/api/student-profile/route.ts` - Student profile API
- `app/complete-profile/page.tsx` - Profile creation page
- `database/fix_user_id_columns.sql` - Database schema fix
- `app/api-test/page.tsx` - API testing page
