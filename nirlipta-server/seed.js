const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

// Import models
const User = require("./models/User");
const Workshop = require("./models/Workshop");
const WorkshopCategory = require("./models/WorkshopCategory");
const Enrollment = require("./models/Enrollment");
const Payment = require("./models/Payment");
const Schedule = require("./models/Schedule");

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nirlipta_yoga_db");
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

// Helper function to get a random photo from uploads directory
const getRandomPhoto = (photoDir, defaultPath = null) => {
    try {
        const fullPath = path.join(__dirname, photoDir);
        if (!fs.existsSync(fullPath)) {
            return defaultPath;
        }
        const files = fs.readdirSync(fullPath).filter(file => 
            /\.(jpg|jpeg|png)$/i.test(file)
        );
        if (files.length === 0) {
            return defaultPath;
        }
        const randomFile = files[Math.floor(Math.random() * files.length)];
        return `/uploads/${path.basename(photoDir)}/${randomFile}`;
    } catch (error) {
        console.error(`Error getting photo from ${photoDir}:`, error);
        return defaultPath;
    }
};

// Seed function
const seedDatabase = async () => {
    try {
        console.log("Starting database seeding...");

        // Clear existing data (optional - comment out if you want to keep existing data)
        // await User.deleteMany({});
        // await Workshop.deleteMany({});
        // await WorkshopCategory.deleteMany({});
        // await Enrollment.deleteMany({});
        // await Payment.deleteMany({});
        // await Schedule.deleteMany({});
        // console.log("Cleared existing data");

        // 1. Create Admin User
        const adminExists = await User.findOne({ email: "admin@nirlipta.com" });
        let adminUser;
        
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("Admin@123", 10);
            adminUser = new User({
                name: "Admin User",
                email: "admin@nirlipta.com",
                username: "admin",
                password: hashedPassword,
                role: "admin",
                status: "active",
                gender: "other",
                medical_conditions: [],
            });
            await adminUser.save();
            console.log("✓ Admin user created");
        } else {
            adminUser = adminExists;
            console.log("✓ Admin user already exists");
        }

        // 2. Create Workshop Categories
        const categories = [
            {
                name: "Hatha Yoga",
                description: "Traditional yoga practice focusing on physical postures and breathing techniques",
            },
            {
                name: "Vinyasa Flow",
                description: "Dynamic yoga practice linking movement with breath",
            },
            {
                name: "Yin Yoga",
                description: "Slow-paced yoga with poses held for longer periods",
            },
            {
                name: "Ashtanga Yoga",
                description: "Rigorous style of yoga with a specific sequence of poses",
            },
            {
                name: "Meditation",
                description: "Mindfulness and meditation practices for inner peace",
            },
        ];

        const createdCategories = [];
        for (const categoryData of categories) {
            let category = await WorkshopCategory.findOne({ name: categoryData.name });
            if (!category) {
                category = new WorkshopCategory({
                    ...categoryData,
                    photo: getRandomPhoto("uploads/category_photos"),
                });
                await category.save();
                console.log(`✓ Category created: ${categoryData.name}`);
            } else {
                console.log(`✓ Category already exists: ${categoryData.name}`);
            }
            createdCategories.push(category);
        }

        // 3. Create Workshops
        const workshops = [
            {
                title: "Introduction to Hatha Yoga",
                description: "Perfect for beginners! Learn the fundamentals of Hatha Yoga in this comprehensive introductory course. We'll cover basic postures, breathing techniques, and relaxation methods.",
                difficulty_level: "beginner",
                price: 2999,
                discount_price: 2499,
                classroom_info: "Spacious studio with natural lighting, mats and props provided",
                address: "123 Yoga Street, Wellness District, City 12345",
                map_location: "https://maps.google.com/?q=123+Yoga+Street",
                category: createdCategories[0]._id,
                modules: [
                    { name: "Module 1: Foundation", duration: 60 },
                    { name: "Module 2: Basic Postures", duration: 90 },
                    { name: "Module 3: Breathing Techniques", duration: 60 },
                    { name: "Module 4: Integration", duration: 90 },
                ],
                photo: getRandomPhoto("uploads/workshop_photos"),
            },
            {
                title: "Vinyasa Flow for Intermediate",
                description: "Take your practice to the next level with dynamic Vinyasa sequences. This course focuses on building strength, flexibility, and flow.",
                difficulty_level: "intermediate",
                price: 3999,
                discount_price: 3499,
                classroom_info: "Modern studio with mirrors and sound system",
                address: "456 Flow Avenue, Movement Quarter, City 12345",
                map_location: "https://maps.google.com/?q=456+Flow+Avenue",
                category: createdCategories[1]._id,
                modules: [
                    { name: "Module 1: Sun Salutations", duration: 75 },
                    { name: "Module 2: Standing Poses", duration: 90 },
                    { name: "Module 3: Arm Balances", duration: 75 },
                    { name: "Module 4: Inversions", duration: 90 },
                ],
                photo: getRandomPhoto("uploads/workshop_photos"),
            },
            {
                title: "Deep Yin Yoga Practice",
                description: "Explore the meditative side of yoga with long-held poses that target deep connective tissues. Ideal for stress relief and flexibility.",
                difficulty_level: "beginner",
                price: 2499,
                discount_price: 1999,
                classroom_info: "Quiet, dimly lit studio with bolsters and blankets",
                address: "789 Serenity Lane, Peace Zone, City 12345",
                map_location: "https://maps.google.com/?q=789+Serenity+Lane",
                category: createdCategories[2]._id,
                modules: [
                    { name: "Module 1: Introduction to Yin", duration: 60 },
                    { name: "Module 2: Hip Openers", duration: 75 },
                    { name: "Module 3: Spine Health", duration: 75 },
                    { name: "Module 4: Deep Relaxation", duration: 60 },
                ],
                photo: getRandomPhoto("uploads/workshop_photos"),
            },
            {
                title: "Ashtanga Primary Series",
                description: "Master the traditional Ashtanga Primary Series in this intensive course. Learn the complete sequence with proper alignment and breath.",
                difficulty_level: "advanced",
                price: 4999,
                discount_price: 4499,
                classroom_info: "Traditional Mysore-style studio",
                address: "321 Tradition Road, Heritage Area, City 12345",
                map_location: "https://maps.google.com/?q=321+Tradition+Road",
                category: createdCategories[3]._id,
                modules: [
                    { name: "Module 1: Opening Sequence", duration: 90 },
                    { name: "Module 2: Standing Series", duration: 120 },
                    { name: "Module 3: Seated Series", duration: 120 },
                    { name: "Module 4: Closing Sequence", duration: 90 },
                ],
                photo: getRandomPhoto("uploads/workshop_photos"),
            },
            {
                title: "Mindfulness Meditation Workshop",
                description: "Learn various meditation techniques to calm your mind, reduce stress, and enhance your overall well-being.",
                difficulty_level: "beginner",
                price: 1999,
                discount_price: 1499,
                classroom_info: "Peaceful meditation hall with cushions",
                address: "654 Mindful Way, Zen District, City 12345",
                map_location: "https://maps.google.com/?q=654+Mindful+Way",
                category: createdCategories[4]._id,
                modules: [
                    { name: "Module 1: Introduction to Meditation", duration: 60 },
                    { name: "Module 2: Breathing Techniques", duration: 60 },
                    { name: "Module 3: Body Scan", duration: 75 },
                    { name: "Module 4: Loving Kindness", duration: 60 },
                ],
                photo: getRandomPhoto("uploads/workshop_photos"),
            },
            {
                title: "Power Vinyasa Intensive",
                description: "High-energy Vinyasa flow designed to build strength, endurance, and mental focus. Not for the faint of heart!",
                difficulty_level: "advanced",
                price: 4499,
                discount_price: 3999,
                classroom_info: "Heated studio with premium mats",
                address: "987 Power Drive, Energy Sector, City 12345",
                map_location: "https://maps.google.com/?q=987+Power+Drive",
                category: createdCategories[1]._id,
                modules: [
                    { name: "Module 1: Warm-up & Flow", duration: 90 },
                    { name: "Module 2: Strength Building", duration: 105 },
                    { name: "Module 3: Advanced Sequences", duration: 105 },
                    { name: "Module 4: Cool Down & Recovery", duration: 75 },
                ],
                photo: getRandomPhoto("uploads/workshop_photos"),
            },
        ];

        const createdWorkshops = [];
        for (const workshopData of workshops) {
            let workshop = await Workshop.findOne({ title: workshopData.title });
            if (!workshop) {
                workshop = new Workshop(workshopData);
                await workshop.save();
                console.log(`✓ Workshop created: ${workshopData.title}`);
            } else {
                console.log(`✓ Workshop already exists: ${workshopData.title}`);
            }
            createdWorkshops.push(workshop);
        }

        // 4. Create Sample Schedules (ensure each workshop has one)
if (createdWorkshops.length > 0) {
    const scheduleDays = ["Monday", "Wednesday", "Friday", "Saturday"];
    const timeSlots = [
        { start: "06:00", end: "07:30" },
        { start: "09:00", end: "10:30" },
        { start: "18:00", end: "19:30" },
    ];

    for (let i = 0; i < createdWorkshops.length; i++) {
        const workshop = createdWorkshops[i];

        const scheduleExists = await Schedule.findOne({
            workshop_id: workshop._id,
        });

        if (!scheduleExists) {
            const schedule = new Schedule({
                workshop_id: workshop._id,
                days_of_week: [
                    scheduleDays[i % scheduleDays.length],
                ],
                start_time: timeSlots[i % timeSlots.length].start,
                end_time: timeSlots[i % timeSlots.length].end,
                status: "active",
            });

            await schedule.save();
            console.log(`✓ Schedule created for: ${workshop.title}`);
        } else {
            console.log(`✓ Schedule already exists for: ${workshop.title}`);
        }
    }
}


        console.log("\n✅ Database seeding completed successfully!");
        console.log(`\nCreated/Verified:`);
        console.log(`- 1 Admin User (email: admin@nirlipta.com, password: Admin@123)`);
        console.log(`- ${createdCategories.length} Categories`);
        console.log(`- ${createdWorkshops.length} Workshops`);
        console.log(`\nYou can now login with admin credentials to manage the system.`);

    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
};

// Main execution
const runSeed = async () => {
    try {
        await connectDB();
        await seedDatabase();
        await mongoose.connection.close();
        console.log("\nDatabase connection closed.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    runSeed();
}

module.exports = { seedDatabase, connectDB };

