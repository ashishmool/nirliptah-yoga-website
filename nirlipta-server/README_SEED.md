# Database Seeding Guide

This guide explains how to use the seed script to populate your database with initial data.

## What the Seed Script Does

The seed script (`seed.js`) creates:

1. **Admin User**
   - Email: `admin@nirlipta.com`
   - Password: `Admin@123`
   - Role: `admin`
   - Status: `active`

2. **Workshop Categories** (5 categories)
   - Hatha Yoga
   - Vinyasa Flow
   - Yin Yoga
   - Ashtanga Yoga
   - Meditation

3. **Workshops** (6 sample workshops)
   - Introduction to Hatha Yoga (Beginner)
   - Vinyasa Flow for Intermediate
   - Deep Yin Yoga Practice (Beginner)
   - Ashtanga Primary Series (Advanced)
   - Mindfulness Meditation Workshop (Beginner)
   - Power Vinyasa Intensive (Advanced)

4. **Schedules** (sample schedules for workshops)

## Prerequisites

1. Make sure MongoDB is running
2. Ensure your `.env` file is configured with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/nirlipta_yoga_db
   ```

## Running the Seed Script

### Option 1: Using npm script
```bash
npm run seed
```

### Option 2: Direct node command
```bash
node seed.js
```

## Important Notes

- The script will **NOT** delete existing data by default
- If an admin user already exists, it will skip creation
- If categories/workshops with the same name exist, they will be skipped
- The script uses random photos from your `uploads/workshop_photos` and `uploads/category_photos` directories

## Customization

You can modify the seed script to:
- Add more workshops
- Change default admin credentials
- Add more categories
- Create sample enrollments or payments

## Troubleshooting

1. **Database connection error**: Check your MongoDB connection string in `.env`
2. **Photo not found**: Make sure you have photos in `uploads/workshop_photos` and `uploads/category_photos`
3. **Duplicate key error**: The script handles duplicates, but if you see this error, check your database

## After Seeding

1. Login with admin credentials:
   - Email: `admin@nirlipta.com`
   - Password: `Admin@123`

2. **IMPORTANT**: Change the admin password immediately after first login!

3. You can now manage workshops, categories, and users through the admin panel.

