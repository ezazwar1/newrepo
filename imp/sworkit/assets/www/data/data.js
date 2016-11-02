var LocalData = (function () {
    "use strict";
    return {
        GetWorkoutTypes: (function () {
            var workoutData = {
                fullBody: {
                    id: 0,
                    activityWeight: 7,
                    activityMFP: "134026252709869",
                    activityNames: "FULL",
                    icon: "fullBody.png",
                    exercises: false,
                    description: "FULL_DESC",
                    googleActivity: "STRENGTH_TRAINING",
                    sessionMActivity: "Full Body",
                    appleActivityHK: "HKWorkoutActivityTypeCrossTraining",
                    humanAPIActivity: "strength_training",
                    isYogaSequence: false
                },
                upperBody: {
                    id: 1,
                    activityWeight: 6,
                    activityMFP: "134026252709869",
                    activityNames: "UPPER",
                    icon: "upperBody.png",
                    exercises: ["Push-ups", "Overhead Press", "Diamond Push-ups", "Overhead Arm Clap", "Wide Arm Push-ups", "Tricep Dips", "Alternating Push-up Plank", "Wall Push-ups", "One Arm Side Push-up", "Jumping Jacks", "Dive Bomber Push-ups", "Chest Expander", "Shoulder Tap Push-ups", "T Raise", "Spiderman Push-up", "Lying Triceps Lifts", "Push-up and Rotation", "Power Circles", "Reverse Plank", "Vertical Arm Rotations"],
                    description: "UPPER_DESC",
                    googleActivity: "STRENGTH_TRAINING",
                    sessionMActivity: "Upper Body",
                    appleActivityHK: "HKWorkoutActivityTypeFunctionalStrengthTraining",
                    humanAPIActivity: "strength_training",
                    isYogaSequence: false
                },
                coreExercise: {
                    id: 2,
                    activityWeight: 6,
                    activityMFP: "134026252709869",
                    activityNames: "CORE",
                    icon: "coreExercise.png",
                    exercises: ["Sit-up", "V Sit-up", "Elevated Crunches", "Leg Spreaders", "Leg Lifts", "Supine Bicycle", "Plank", "Burpees", "Twisting Crunches", "Inch Worms", "Supermans", "Windmill", "Bent Leg Twist", "Side Bridge", "Quadraplex", "Swimmer", "Mason Twist", "Steam Engine", "In and Out Abs", "Six Inch and Hold", "Scissor Kicks", "Lateral Pillar Bridge", "Plank Jacks", "Plank with Arm Lift", "Reach Ups", "Standing Side Crunch", "Reach Throughs", "V Balance"],
                    description: "CORE_DESC",
                    googleActivity: "STRENGTH_TRAINING",
                    sessionMActivity: "Core Strength",
                    appleActivityHK: "HKWorkoutActivityTypeFunctionalStrengthTraining",
                    humanAPIActivity: "strength_training",
                    isYogaSequence: false
                },
                lowerBody: {
                    id: 3,
                    activityWeight: 6,
                    activityMFP: "134026252709869",
                    activityNames: "LOWER",
                    icon: "lowerBody.png",
                    exercises: ["Squats", "Jump Squats", "Forward Lunges", "Rear Lunges", "Mountain Climbers", "Front Kicks", "Running in Place", "Side Leg Lifts", "Single Leg Squats", "Reverse V Lunges", "Hip Raise", "High Jumper", "Side to Side Knee Lifts", "Frog Jumps", "Calf Raises", "Genie Sit", "High Knees", "Butt Kickers", "Wall Sit", "Crab Walk", "Iron Mike", "Squat with Back Kick", "Wide Squats", "Side Squat"],
                    description: "LOWER_DESC",
                    googleActivity: "STRENGTH_TRAINING",
                    sessionMActivity: "Lower Body",
                    appleActivityHK: "HKWorkoutActivityTypeFunctionalStrengthTraining",
                    humanAPIActivity: "strength_training",
                    isYogaSequence: false
                },
                stretchExercise: {
                    id: 4,
                    activityWeight: 4,
                    activityMFP: "133478623407981",
                    activityNames: "STRETCH",
                    icon: "stretchExercise.png",
                    exercises: ["Quadricep Stretch", "Hamstring Stretch Standing", "Kneeling Hip Flexor", "Overhead Arm Pull", "Chest Stretch", "Abdominal Stretch", "Side Stretch", "Butterfly Stretch", "Seated Hamstring Stretch", "Calf Stretch", "Neck Stretch", "Lower Back Stretch", "Bending Windmill Stretch", "Bend and Reach", "Arm and Shoulder Stretch", "Shoulder Shrugs", "Hurdlers Stretch", "Ankle on the Knee", "Arm Circles", "Knee to Chest Stretch", "Single Leg Hamstring", "Neck Extension Backward", "Neck Flex Forward", "Neck Rotation Stretch", "Single Leg Stretch"],
                    description: "FULL_STRETCH_DESC",
                    googleActivity: "CALISTHENICS",
                    sessionMActivity: "Stretch",
                    appleActivityHK: "HKWorkoutActivityTypePreparationAndRecovery",
                    humanAPIActivity: "stretching",
                    isYogaSequence: false
                },
                backStrength: {
                    id: 5,
                    activityWeight: 5,
                    activityMFP: "133476496895469",
                    activityNames: "BACK_STRENGTH",
                    icon: "backStrength.png",
                    exercises: ["Hip Raise", "Quadraplex", "Side Plank", "Forward Lunges", "Plank", "Lower Back Stretch", "Laying Spinal Twist", "Kneeling Hip Flexor", "Side Stretch", "Genie Sit", "Side Bend on Floor", "Laying Back Extension"],
                    description: "BACK_DESC",
                    googleActivity: "CALISTHENICS",
                    sessionMActivity: "Stretch",
                    appleActivityHK: "HKWorkoutActivityTypePreparationAndRecovery",
                    humanAPIActivity: "stretching",
                    isYogaSequence: false
                },
                anythingGoes: {
                    id: 6,
                    activityWeight: 5,
                    activityMFP: "134026252709869",
                    activityNames: "ANYTHING",
                    icon: "anythingGoes.png",
                    exercises: false,
                    description: "ANYTHING_DESC",
                    googleActivity: "CIRCUIT_TRAINING",
                    sessionMActivity: "Anything Goes",
                    appleActivityHK: "HKWorkoutActivityTypeCrossTraining",
                    humanAPIActivity: "strength_training",
                    isYogaSequence: false
                },
                sunSalutation: {
                    id: 7,
                    activityWeight: 5,
                    activityMFP: "133751232154941",
                    activityNames: "SUN_SALUTATION",
                    icon: "sunSalutation.png",
                    exercises: ["Prayer Pose", "Raised Arms Pose", "Forward Fold", "Low Lunge (Left Forward)", "Downward Dog", "Plank Pose", "Four Limbs Pose", "Cobra Pose", "Downward Dog", "Low Lunge (Right Forward)", "Forward Fold", "Raised Arms Pose", "Prayer Pose", "Raised Arms Pose", "Forward Fold", "Low Lunge (Right Forward)", "Downward Dog", "Plank Pose", "Four Limbs Pose", "Cobra Pose", "Downward Dog", "Low Lunge (Left Forward)", "Forward Fold", "Raised Arms Pose"],
                    description: "SUN_DESC",
                    googleActivity: "YOGA",
                    sessionMActivity: "Yoga",
                    appleActivityHK: "HKWorkoutActivityTypeYoga",
                    humanAPIActivity: "yoga",
                    isYogaSequence: true
                },
                fullSequence: {
                    id: 8,
                    activityWeight: 4,
                    activityMFP: "133751232154941",
                    activityNames: "FULL_SEQ",
                    icon: "fullSequence.png",
                    exercises: ["Mountain Pose", "Raised Arms Pose", "Side Bend Left", "Side Bend Right", "Forward Fold", "Forward Fold Hands Behind", "Chair Pose", "Chair Pose Twist Left", "Chair Pose Twist Right", "Forward Fold", "Mountain Pose", "Wide Leg Stance", "Wide Leg Stance Arms Up", "Wide Leg Forward Fold", "Wide Leg Stance", "Triangle Left", "Wide Leg Stance", "Triangle Right", "Wide Leg Stance", "Warrior II (Left Forward)", "Side Angle Left", "Wide Leg Stance", "Warrior II (Right Forward)", "Side Angle Right", "Wide Leg Stance", "Mountain Pose", "Forward Fold", "Low Lunge (Left Forward)", "Plank Pose", "Four Limbs Pose", "Cobra Pose", "Downward Dog", "Low Lunge (Right Forward)", "Forward Fold", "Mountain Pose", "Tree Pose Left", "Tree Pose Right", "Head to Knee Left", "Head to Knee Right", "Twist Left", "Twist Right", "Lay on Back", "Prep for Shoulder Stand", "Plow", "Shoulder Stand", "Lay on Back", "Fish Pose", "Lay on Back", "Lay on Back", "Lay on Back", "Lay on Back"],
                    description: "SEQ_DESC",
                    googleActivity: "YOGA",
                    sessionMActivity: "Yoga",
                    appleActivityHK: "HKWorkoutActivityTypeYoga",
                    humanAPIActivity: "yoga",
                    isYogaSequence: true
                },
                bootCamp: {
                    id: 9,
                    activityWeight: 7,
                    activityMFP: "134026252709869",
                    activityNames: "BOOT_CAMP",
                    icon: "bootCamp.png",
                    exercises: ["Push-ups", "Overhead Press", "Overhead Arm Clap", "Jumping Jacks", "Sit-up", "Leg Spreaders", "Supine Bicycle", "Windmill", "Squats", "Mountain Climbers", "High Jumper", "Plank", "Front Kicks", "Star Jumps", "Steam Engine", "Diamond Push-ups", "Dive Bomber Push-ups", "Six Inch and Hold", "Swimmer", "Star Jumps", "Squat Jacks", "Iron Mike"],
                    description: "BOOT_DESC",
                    googleActivity: "CIRCUIT_TRAINING",
                    sessionMActivity: "Bonus Workout",
                    appleActivityHK: "HKWorkoutActivityTypeCrossTraining",
                    humanAPIActivity: "strength_training",
                    isYogaSequence: false
                },
                rumpRoaster: {
                    id: 10,
                    activityWeight: 6,
                    activityMFP: "134026252709869",
                    activityNames: "RUMP",
                    icon: "rumpRoaster.png",
                    exercises: ["Leg Spreaders", "Leg Lifts", "Squats", "Mountain Climbers", "Hip Raise", "Quadraplex", "Bent Leg Twist", "Side Bridge", "Forward Lunges", "Rear Lunges", "Kneeling Hip Flexor", "Side Leg Lifts", "Side to Side Knee Lifts", "High Knees", "Squat Jacks", "Side Circles", "Side Sweep", "Wide Squats", "Side Squat"],
                    description: "RUMP_DESC",
                    googleActivity: "CIRCUIT_TRAINING",
                    sessionMActivity: "Bonus Workout",
                    appleActivityHK: "HKWorkoutActivityTypeCrossTraining",
                    humanAPIActivity: "strength_training",
                    isYogaSequence: false
                },
                cardio: {
                    id: 11,
                    activityWeight: 8,
                    activityMFP: "134026252709869",
                    activityNames: "CARDIO_FULL",
                    icon: "cardio.png",
                    exercises: ["Fast Feet", "Step Touch", "Power Skip", "High Knees", "Butt Kickers", "Jump Rope Hops", "Side Hops", "Pivoting Upper Cuts", "Squat Jabs", "Skaters", "Single Leg Hops", "Switch Kick", "Jumping Planks", "Star Jumps", "Running in Place", "Jumping Jacks", "Front Kicks", "Windmill", "Sprinter", "Power Jump", "Single Lateral Hops", "Shoulder Tap Push-ups", "Squat Jacks", "Lunge Jumps", "Up Downs", "Burpees", "Mountain Climbers", "X Drill Alternate Feet", "X Drill Rotations", "Standing Mountain Climber", "Knee to Chest Hops"],
                    description: "CARDIO_FULL_DESC",
                    googleActivity: "CIRCUIT_TRAINING",
                    sessionMActivity: "Cardio",
                    appleActivityHK: "HKWorkoutActivityTypeMixedMetabolicCardioTraining",
                    humanAPIActivity: "cardio",
                    isYogaSequence: false
                },
                bringThePain: {
                    id: 12,
                    activityWeight: 8,
                    activityMFP: "134026252709869",
                    activityNames: "BRING_PAIN",
                    icon: "bringThePain.png",
                    exercises: ["Push-ups", "Alternating Push-up Plank", "Tricep Dips", "Dive Bomber Push-ups", "Supine Bicycle", "Burpees", "Spiderman Push-up", "Steam Engine", "Six Inch and Hold", "Jump Squats", "Mountain Climbers", "Pivoting Upper Cuts", "Squat Jabs", "Sprinter", "Power Jump", "Up Downs", "Shoulder Tap Push-ups", "Lunge Jumps", "Squat Jacks", "Leg Spreaders", "Fast Feet", "Switch Kick", "Iron Mike", "Plank Jacks", "Knee to Chest Hops"],
                    description: "BRING_DESC",
                    googleActivity: "CIRCUIT_TRAINING",
                    sessionMActivity: "Bonus Workout",
                    appleActivityHK: "HKWorkoutActivityTypeCrossTraining",
                    humanAPIActivity: "strength_training",
                    isYogaSequence: false
                },
                customWorkout: {
                    id: 13,
                    activityWeight: 6,
                    activityMFP: "134026252709869",
                    activityNames: "CUSTOM_SM",
                    icon: "fullBody.png",
                    exercises: false,
                    description: "CUSTOM_DESC",
                    googleActivity: "Custom Workout",
                    appleActivityHK: "HKWorkoutActivityTypeCrossTraining",
                    humanAPIActivity: "circuit_training",
                    isYogaSequence: false
                },
                headToToe: {
                    id: 14,
                    activityWeight: 4,
                    activityMFP: "133478623407981",
                    activityNames: "HEAD_TOE",
                    icon: "headToToe.png",
                    exercises: ["Neck Stretch", "Arm and Shoulder Stretch", "Overhead Arm Pull", "Abdominal Stretch", "Chest Stretch", "Quadricep Stretch", "Hamstring Stretch Standing", "Calf Stretch", "Butterfly Stretch", "Seated Hamstring Stretch", "Kneeling Hip Flexor", "Lower Back Stretch", "Ankle on the Knee", "Side Circles", "Side Sweep"],
                    description: "HEAD_DESC",
                    googleActivity: "CALISTHENICS",
                    sessionMActivity: "Stretch",
                    appleActivityHK: "HKWorkoutActivityTypePreparationAndRecovery",
                    humanAPIActivity: "stretching",
                    isYogaSequence: false
                },
                cardioLight: {
                    id: 15,
                    activityWeight: 5,
                    activityMFP: "133476505251693",
                    activityNames: "CARDIO_LIGHT",
                    icon: "cardioLight.png",
                    exercises: ["Step Touch", "High Knees", "Butt Kickers", "Jump Rope Hops", "Single Leg Hops", "Running in Place", "Jumping Jacks", "Front Kicks", "Windmill", "Bend and Reach", "Calf Raises", "Arm Circles", "Side Hops", "Plank Side Walk", "Side Shuffle"],
                    description: "CARDIO_LIGHT_DESC",
                    googleActivity: "CIRCUIT_TRAINING",
                    sessionMActivity: "Cardio",
                    appleActivityHK: "HKWorkoutActivityTypeMixedMetabolicCardioTraining",
                    humanAPIActivity: "cardio",
                    isYogaSequence: false
                },
                sevenMinute: {
                    id: 16,
                    activityWeight: 7,
                    activityMFP: "134026252709869",
                    activityNames: "SEVEN_MINUTE",
                    icon: "sevenMinute.png",
                    exercises: ["Jumping Jacks", "Wall Sit", "Push-ups", "Abdominal Crunch", "Step Ups", "Squats", "Tricep Dips", "Plank", "High Knees", "Lunge", "Push-up and Rotation", "Side Plank"],
                    description: "SEVEN_MIN_DESC",
                    googleActivity: "CIRCUIT_TRAINING",
                    sessionMActivity: "Bonus Workout",
                    appleActivityHK: "HKWorkoutActivityTypeCrossTraining",
                    humanAPIActivity: "circuit_training",
                    isYogaSequence: false
                },
                standingStretches: {
                    id: 17,
                    activityWeight: 4,
                    activityMFP: "133478623407981",
                    activityNames: "STANDING",
                    icon: "standingStretches.png",
                    exercises: ["Quadricep Stretch", "Hamstring Stretch Standing", "Overhead Arm Pull", "Chest Stretch", "Abdominal Stretch", "Side Stretch", "Calf Stretch", "Neck Stretch", "Arm and Shoulder Stretch", "Shoulder Shrugs", "Arm Circles"],
                    description: "STANDING_DESC",
                    googleActivity: "CALISTHENICS",
                    sessionMActivity: "Stretch",
                    appleActivityHK: "HKWorkoutActivityTypePreparationAndRecovery",
                    humanAPIActivity: "stretching",
                    isYogaSequence: false
                },
                pilatesWorkout: {
                    id: 18,
                    activityWeight: 6,
                    activityMFP: "133201476341181",
                    activityNames: "PILATES",
                    icon: "pilatesWorkout.png",
                    exercises: ["Swan", "Double Leg Stretch", "Spine Stretch Forward", "Seated Spine Twist", "Leg Pull Front", "Leg Pull Back", "The Hundred", "Rollover", "Back Arm Rowing", "Swimming", "Double Leg Kick", "Laying Side Kick", "Teaser", "Wag Your Tail", "Corkscrew", "Roll Up", "One Leg Circles", "Bicycle", "Inner Thigh Lifts", "The Saw", "Kneeling Circles"],
                    description: "PILATES_DESC",
                    googleActivity: "PILATES",
                    sessionMActivity: "Pilates",
                    appleActivityHK: "HKWorkoutActivityTypeDanceInspiredTraining",
                    humanAPIActivity: "pilates",
                    isYogaSequence: false
                },
                quickFive: {
                    id: 19,
                    activityWeight: 7,
                    activityMFP: "134026252709869",
                    activityNames: "QUICK",
                    icon: "fullBody.png",
                    exercises: ["Alternating Push-up Plank", "Wall Push-ups", "Jumping Jacks", "Supine Bicycle", "Plank", "Squats", "Forward Lunges", "Mountain Climbers", "Running in Place", "Windmill", "Bent Leg Twist", "Squat Jacks", "Up Downs", "One Arm Side Push-up", "Calf Raises", "Mason Twist", "Steam Engine", "Seated Spine Twist", "Swimming", "X Drill Alternate Feet", "Push Up on Knees", "Step Touch", "Quadraplex", "The Hundred"],
                    description: "QUICK",
                    googleActivity: "CIRCUIT_TRAINING",
                    sessionMActivity: "Quick Five",
                    appleActivityHK: "HKWorkoutActivityTypeCrossTraining",
                    humanAPIActivity: "circuit_training",
                    isYogaSequence: false
                },
                plyometrics: {
                    id: 20,
                    activityWeight: 8,
                    activityMFP: "133476505251693",
                    activityNames: "PLYOMETRICS",
                    icon: "plyometrics.png",
                    exercises: ["Jumping Jacks", "Burpees", "Jump Squats", "Mountain Climbers", "High Jumper", "Frog Jumps", "Power Skip", "Jump Rope Hops", "Side Hops", "Skaters", "Single Leg Hops", "Switch Kick", "Jumping Planks", "Star Jumps", "Sprinter", "Power Jump", "Squat Jacks", "Lunge Jumps", "Up Downs", "Iron Mike", "Knee to Chest Hops"],
                    description: "PLYOMETRICS_DESC",
                    googleActivity: "CIRCUIT_TRAINING",
                    sessionMActivity: "Cardio",
                    appleActivityHK: "HKWorkoutActivityTypeMixedMetabolicCardioTraining",
                    humanAPIActivity: "cardio",
                    isYogaSequence: false
                },
                runnerYoga: {
                    id: 21,
                    activityWeight: 5,
                    activityMFP: "133751232154941",
                    activityNames: "RUNNER_YOGA",
                    icon: "runnerYoga.png",
                    exercises: ["Mountain Pose", "Raised Arms Pose", "Forward Fold", "Low Lunge (Left Forward)", "Warrior II (Left Forward)", "Triangle Left", "Low Lunge (Left Forward)", "Downward Dog", "Child Pose", "Head to Knee Left", "Butterfly Stretch", "Head to Knee Right", "Child Pose", "Downward Dog", "Forward Fold", "Mountain Pose", "Raised Arms Pose", "Forward Fold", "Low Lunge (Right Forward)", "Warrior II (Right Forward)", "Triangle Right", "Low Lunge (Right Forward)", "Downward Dog", "Child Pose", "Head to Knee Right", "Butterfly Stretch", "Head to Knee Left", "Child Pose", "Downward Dog", "Forward Fold", "Raised Arms Pose", "Mountain Pose"],
                    description: "RUNNER_DESC",
                    googleActivity: "YOGA",
                    sessionMActivity: "Yoga",
                    appleActivityHK: "HKWorkoutActivityTypeYoga",
                    humanAPIActivity: "yoga",
                    isYogaSequence: true
                },
                officeStretch: {
                    id: 22,
                    activityWeight: 4,
                    activityMFP: "133478623407981",
                    activityNames: "OFFICE",
                    icon: "fullSequence.png",
                    exercises: ["Hamstring Stretch Standing", "Overhead Arm Pull", "Chest Stretch", "Abdominal Stretch", "Calf Stretch", "Neck Stretch", "Arm and Shoulder Stretch", "Shoulder Shrugs", "Arm Circles", "Side Bend Left", "Side Bend Right", "Triangle Left", "Triangle Right", "Neck Extension Backward", "Neck Flex Forward", "Neck Rotation Stretch", "2 Hand Wrist Extension"],
                    description: "OFFICE_DESC",
                    googleActivity: "CALISTENICS",
                    sessionMActivity: "Stretch",
                    appleActivityHK: "HKWorkoutActivityTypePreparationAndRecovery",
                    humanAPIActivity: "stretching",
                    isYogaSequence: false
                },
                lowImpactUpper: {
                    id: 23,
                    activityWeight: 4,
                    activityMFP: "134026252709869",
                    activityNames: "LOWUPPER",
                    icon: "lowImpactUpper.png",
                    exercises: ["Overhead Arm Clap", "Wall Push-ups", "Chest Expander", "Steam Engine", "Arm Circles", "Good Mornings", "Vertical Arm Rotations", "Standing Side Crunch", "Twist", "Elbow to Knee", "Knee to Chest", "Chair Bend", "Cat Curl", "Sawing Wood", "Reach and Pull", "Field Goal", "Arm Push Back", "Boxer", "Arm Raises", "Arm Crosses", "Biceps Curl", "Apple Picker", "Calf Stretch"],
                    description: "LOWUPPER_DESC",
                    googleActivity: "STRENGTH_TRAINING",
                    sessionMActivity: "Upper Body",
                    appleActivityHK: "HKWorkoutActivityTypeFunctionalStrengthTraining",
                    humanAPIActivity: "strength_training",
                    isYogaSequence: false
                },
                lowImpactLower: {
                    id: 24,
                    activityWeight: 4,
                    activityMFP: "134026252709869",
                    activityNames: "LOWLOWER",
                    icon: "lowImpactLower.png",
                    exercises: ["Front Kicks", "Low Lunge (Left Forward)", "Low Lunge (Right Forward)", "Wide Squats", "Side Leg Raise", "Hip Opener", "Back Leg Raise", "Toe Lift", "Chair Squat", "Half Squat", "Elbow to Knee", "Rocking Horse", "Balance on Toes", "Leg Extension", "Side Facing", "Leg Curl"],
                    description: "LOWLOWER_DESC",
                    googleActivity: "STRENGTH_TRAINING",
                    sessionMActivity: "Lower Body",
                    appleActivityHK: "HKWorkoutActivityTypeFunctionalStrengthTraining",
                    humanAPIActivity: "strength_training",
                    isYogaSequence: false
                },
                lowImpactCardio: {
                    id: 25,
                    activityWeight: 5,
                    activityMFP: "133476505251693",
                    activityNames: "LOWCARDIO",
                    icon: "lowImpactCardio.png",
                    exercises: ["Windmill", "Step Touch", "Squat Jabs", "Power Circles", "Steam Engine", "Standing Side Crunch", "Side Leg Raise", "Chair Squat", "Half Squat", "Elbow to Knee", "Sawing Wood", "Boxer", "Rocking Horse", "Side to Side", "March in Place", "Apple Picker"],
                    description: "LOWCARDIO_DESC",
                    googleActivity: "CIRCUIT_TRAINING",
                    sessionMActivity: "Cardio",
                    appleActivityHK: "HKWorkoutActivityTypeMixedMetabolicCardioTraining",
                    humanAPIActivity: "cardio",
                    isYogaSequence: false
                },
                lowImpactFlexibility: {
                    id: 26,
                    activityWeight: 3,
                    activityMFP: "133478623407981",
                    activityNames: "LOWFLEXIBILITY",
                    icon: "lowImpactFlexibility.png",
                    exercises: ["Chest Stretch", "Calf Stretch", "Hip Opener", "Back Leg Raise", "Front Bend", "Toe Lift", "Heel to Shin", "Straddle", "Hamstring", "Ankle Rotation", "Head Tilt", "Forward Head Roll", "Side Bend", "Reach Across", "Shoulder Roll", "Back Scratch", "Double Chin", "Head Turn", "Hand Wave", "Wrist Curl", "Wrist Circles", "Flamingo", "Rocking Horse", "Balance on Toes", "Single Leg Swing", "Toe Pointer", "Leg Extension", "Open and Close", "Chest Expansion", "Opening Chest", "Biceps and Wrist Stretch"],
                    description: "LOWFLEXIBILITY_DESC",
                    googleActivity: "CALISTHENICS",
                    sessionMActivity: "Stretch",
                    appleActivityHK: "HKWorkoutActivityTypePreparationAndRecovery",
                    humanAPIActivity: "stretching",
                    isYogaSequence: false
                },
                feelGoodYoga: {
                    id: 27,
                    activityWeight: 5,
                    activityMFP: "133751232154941",
                    activityNames: "FEELGOOD_YOGA",
                    icon: "feelGoodYoga.png",
                    exercises: ["Prayer Pose","Raised Arms Pose","Chair Pose","Forward Fold Hands Behind","Four Limbs Pose","Cobra Pose","Child Pose","Downward Dog","Cow Pose","Cat Pose","Low Lunge (Left Forward)","Plank Pose","Low Lunge (Right Forward)","Four Limbs Pose","Cobra Pose","Child Pose","Downward Dog","Mountain Pose","Warrior II (Left Forward)","Wide Leg Stance","Warrior II (Right Forward)","Wide Leg Stance","Wide Leg Stance Arms Up","Wide Leg Forward Fold","Wide Leg Stance","Tree Pose Left","Tree Pose Right","Mountain Pose","Raised Arms Pose","Prayer Pose"],
                    description: "FEELGOOD_DESC",
                    googleActivity: "YOGA",
                    sessionMActivity: "Yoga",
                    appleActivityHK: "HKWorkoutActivityTypeYoga",
                    humanAPIActivity: "yoga",
                    isYogaSequence: true
                },
                beginnerYoga: {
                    id: 28,
                    activityWeight: 5,
                    activityMFP: "133751232154941",
                    activityNames: "BEGINNER_YOGA",
                    icon: "beginnerYoga.png",
                    exercises: ["Cow Pose", "Cat Pose", "Downward Dog", "Raised Arms Pose", "Mountain Pose", "Side Bend Right", "Side Bend Left", "Raised Arms Pose", "Standing Forward Bend", "Downward Dog", "Plank Pose", "Four Limbs Pose", "Cobra Pose", "Child Pose", "Downward Dog", "Low Lunge (Right Forward)", "Low Lunge (Left Forward)", "Downward Dog", "Plank Pose", "Four Limbs Pose", "Cobra Pose", "Child Pose", "Downward Dog", "Raised Arms Pose", "Mountain Pose", "Chair Pose", "Staff Pose", "Head to Knee Right", "Head to Knee Left", "Half Spinal Twist", "Bridge Pose", "Lay on Back"],
                    description: "BEGINNER_DESC",
                    googleActivity: "YOGA",
                    sessionMActivity: "Yoga",
                    appleActivityHK: "HKWorkoutActivityTypeYoga",
                    humanAPIActivity: "yoga",
                    isYogaSequence: true
                },
                coreYoga: {
                    id: 29,
                    activityWeight: 6,
                    activityMFP: "133751232154941",
                    activityNames: "CORE_YOGA",
                    icon: "coreYoga.png",
                    exercises: ["Prayer Pose", "Chair Pose", "Chair Pose Twist Right", "Chair Pose Twist Left", "Plank Pose", "Downward Dog", "Plank Pose", "Four-Limbed Staff Pose", "Plank Pose", "Downward Dog", "Three-Legged Down Dog (Right)", "Low Lunge (Right Forward)", "Plank Pose", "Four-Limbed Staff Pose", "Upward Facing Dog", "Downward Dog", "Three-Legged Down Dog (Left)", "Low Lunge (Left Forward)", "Plank Pose", "Four-Limbed Staff Pose", "Upward Facing Dog", "Downward Dog", "Raised Arms Pose", "Prayer Pose", "Warrior Pose III (Right)", "Warrior Pose III (Left)", "Plank Pose", "Four-Limbed Staff Pose", "Upward Facing Dog", "Downward Dog", "Crow Pose", "Child Pose", "Shoulder Stand", "Plow", "Fish Pose", "Lay on Back"],
                    description: "CORE_DESC",
                    googleActivity: "YOGA",
                    sessionMActivity: "Yoga",
                    appleActivityHK: "HKWorkoutActivityTypeYoga",
                    humanAPIActivity: "yoga",
                    isYogaSequence: true
                },
                toneYoga: {
                    id: 30,
                    activityWeight: 7,
                    activityMFP: "133751232154941",
                    activityNames: "TONE_YOGA",
                    icon: "toneYoga.png",
                    exercises: ["Mountain Pose", "Chair Pose", "Warrior Pose I (Right)", "Warrior II (Right Forward)", "Side Angle Right", "Plank Pose", "Four Limbs Pose", "Upward Facing Dog", "Downward Dog", "Warrior Pose I (Left)", "Warrior II (Left Forward)", "Side Angle Left", "Plank Pose", "Four Limbs Pose", "Upward Facing Dog", "Downward Dog", "Forward Fold", "Raised Arms Pose", "Mountain Pose", "Tree Pose Right", "Tree Pose Left", "Eagle Pose (Right)", "Eagle Pose (Left)", "Prayer Pose", "Raised Arms Pose", "Chair Pose", "Standing Forward Bend", "Plank Pose", "Four Limbs Pose", "Upward Facing Dog", "Downward Dog", "Forward Fold", "Raised Arms Pose", "Mountain Pose"],
                    description: "TONE_DESC",
                    googleActivity: "YOGA",
                    sessionMActivity: "Yoga",
                    appleActivityHK: "HKWorkoutActivityTypeYoga",
                    humanAPIActivity: "yoga",
                    isYogaSequence: true
                },
                sixPackChallenge: {
                    id: 31,
                    activityWeight: 6,
                    activityMFP: "134026252709869",
                    activityNames: "SIXPACK",
                    icon: "sixPackChallenge.png",
                    exercises: ["Sit-up", "V Sit-up", "Elevated Crunches", "Supine Bicycle", "Plank", "Twisting Crunches", "Bent Leg Twist", "Genie Sit", "Mason Twist", "Steam Engine", "In and Out Abs", "Six Inch and Hold", "The Hundred", "Teaser"],
                    description: "SIXPACK_DESC",
                    googleActivity: "STRENGTH_TRAINING",
                    sessionMActivity: "Core Strength",
                    appleActivityHK: "HKWorkoutActivityTypeFunctionalStrengthTraining",
                    humanAPIActivity: "strength_training",
                    isYogaSequence: false
                },
                calorieBurningCardio: {
                    id: 32,
                    activityWeight: 8,
                    activityMFP: "134026252709869",
                    activityNames: "CALORIEBURN",
                    icon: "calorieBurningCardio.png",
                    exercises: ["Fast Feet", "Step Touch", "Power Skip", "High Knees", "Butt Kickers", "Jump Rope Hops", "Side Hops", "Pivoting Upper Cuts", "Squat Jabs", "Skaters", "Single Leg Hops", "Switch Kick", "Jumping Planks", "Star Jumps", "Running in Place", "Jumping Jacks", "Front Kicks", "Windmill", "Sprinter", "Power Jump", "Single Lateral Hops", "Shoulder Tap Push-ups", "Squat Jacks", "Lunge Jumps", "Up Downs", "Burpees", "Mountain Climbers", "X Drill Alternate Feet", "X Drill Rotations", "Standing Mountain Climber", "Knee to Chest Hops"],
                    description: "CALORIEBURN_DESC",
                    googleActivity: "CIRCUIT_TRAINING",
                    sessionMActivity: "Cardio",
                    appleActivityHK: "HKWorkoutActivityTypeMixedMetabolicCardioTraining",
                    humanAPIActivity: "cardio",
                    isYogaSequence: false
                }
            };

            return workoutData;
        }()),
        GetWorkoutCategories: (function () {
            var workoutCategories = [
                {
                    workoutTypes: ["fullBody", "upperBody", "coreExercise", "lowerBody"],
                    legacyBasicWorkouts: [],
                    legacyProWorkouts: ["sevenMinute", "rumpRoaster"],
                    premiumWorkouts: ["sixPackChallenge", "lowImpactUpper", "lowImpactLower"],
                    fullName: "STRENGTH"
                },
                {
                    workoutTypes: ["cardioLight", "cardio"],
                    legacyBasicWorkouts: ["plyometrics", "bootCamp"],
                    legacyProWorkouts: ["bringThePain"],
                    premiumWorkouts: ["calorieBurningCardio", "lowImpactCardio"],
                    fullName: "CARDIO"
                },
                {
                    workoutTypes: ["sunSalutation", "feelGoodYoga"],
                    legacyBasicWorkouts: ["runnerYoga", "pilatesWorkout"],
                    legacyProWorkouts: [],
                    premiumWorkouts: ["beginnerYoga", "coreYoga", "toneYoga"],
                    fullName: "YOGA"
                },
                {
                    workoutTypes: ["headToToe", "stretchExercise", "standingStretches", "backStrength"],
                    legacyBasicWorkouts: [],
                    legacyProWorkouts: ["officeStretch"],
                    premiumWorkouts: ["lowImpactFlexibility"],
                    fullName: "STRETCHING"
                }
            ];
            return workoutCategories;
        }())
    }
}());

var TimingData = (function () {
    "use strict";
    return {
        GetTimingSettings: (function () {
            var timingData = {
                customSet: false,
                breakFreq: 5,
                exerciseTime: 30,
                breakTime: 30,
                transitionTime: 5,
                transition: true,
                randomizationOption: true,
                workoutLength: 15,
                audioOption: true,
                warningAudio: true,
                countdownBeep: true,
                autoPlay: true,
                countdownStyle: true,
                welcomeAudio: true,
                autoStart: true,
                restStatus: true,
                sunSalutation: 8,
                fullSequence: 21,
                runnerYoga: 15,
                feelGoodYoga: 15,
                beginnerYoga: 20,
                coreYoga: 20,
                toneYoga: 20
            };
            return timingData;
        }()),
        GetSevenMinuteSettings: (function () {
            var timingData = {
                customSetSeven: true,
                breakFreqSeven: 0,
                exerciseTimeSeven: 30,
                breakTimeSeven: 0,
                transitionTimeSeven: 10,
                randomizationOptionSeven: false,
                workoutLengthSeven: 7
            };
            return timingData;
        }())
    }
}());

var PersonalData = (function () {
    "use strict";
    return {
        GetUserSettings: (function () {
            var userData = {
                weight: 150,
                weightType: 0,
                kiipRewards: true,
                mPoints: false,
                mfpStatus: false,
                myFitnessReady: false,
                mfpWeight: false,
                mfpAccessToken: false,
                mfpRefreshToken: false,
                videosDownloaded: false,
                downloadDecision: true,
                healthKit: false,
                lastLength: 5,
                timerTaps: 0,
                showNext: true,
                showAudioTip: true,
                humanapiClientUserId: null,
                humanapiHumanId: '',
                humanapiAccessToken: null,
                humanapiPublicToken: null
            };
            return userData;
        }()),
        GetUserGoals: (function () {
            var userGoals = {
                dailyGoal: 15,
                weeklyGoal: 75
            };
            return userGoals;
        }()),
        GetUserProgress: (function () {
            var userProgress = {
                monthlyTotal: 0,
                weeklyTotal: 0,
                dailyTotal: 0,
                totalCalories: 0,
                totalProgress: 0,
                day: 0,
                week: 0
            };
            return userProgress;
        }()),
        GetCustomWorkouts: (function () {
            var userCustomWorkouts = {
                savedWorkouts: []
            };
            return userCustomWorkouts;
        }()),
        GetWorkoutArray: (function () {
            var userCustomArray = {
                workoutArray: []
            };
            return userCustomArray;
        }()),
        GetLanguageSettings: (function () {
            var userLanguages = {
                EN: true,
                DE: false,
                FR: false,
                ES: false,
                ESLA: false,
                IT: false,
                PT: false,
                HI: false,
                JA: false,
                ZH: false,
                KO: false,
                RU: false,
                TR: false
            };
            return userLanguages;
        }()),
        GetAudioSettings: (function () {
            var backgroundAudio = {
                ignoreDuck: false,
                duckOnce: true,
                duckEverything: false
            };
            return backgroundAudio;
        }()),
        GetGoogleFit: (function () {
            var googleFitData = {
                enabled: false,
                attempted: false
            };
            return googleFitData;
        }()),
        GetUserProfile: (function () {
            var profileData = {
                email: '',
                firstName: '',
                lastName: '',
                gender: '',
                emailPreference: true,
                birthYear: '',
                photo: false,
                authType: '',
                locale: '',
                goals: [],
                lastLogin: ''
            };
            return profileData;
        }())
    }
}());

var LocalHistory = (function () {
    "use strict";
    return {
        getCustomHistory: (function () {
            var lastHomeURL = {
                url: ''
            };
            return lastHomeURL;
        }())
    }
}());

LocalData.SetReminder = {
    daily: {status: false, time: 7, minutes: 0},
    inactivity: {frequency: 2, status: false, time: 7, minutes: 0}
};
