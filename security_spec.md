# Security Specification for Firestore

## Data Invariants
1. Articles can be read by anyone (public news site). Modifying articles requires authentication.
2. CMS site settings can be read publicly and modified by authenticated admins/users.
3. Comments can be read publicly, created by authenticated users, and edited/deleted by their author or admin.
4. User profiles can be read by authenticated users and written only by the profile owner.

## Target Collections & Access Rules
- `/articles/{articleId}`: Public read, authenticated write.
- `/settings/{settingsId}`: Public read, authenticated write.
- `/comments/{commentId}`: Public read, authenticated write for comments.
- `/matches/{matchId}`: Public read, authenticated write.
- `/users/{userId}`: Authenticated read and write for owner (`request.auth.uid == userId`).
