const profileModel = require("../models/profileSchema.js");
const id = require('../id.js');

module.exports = {
    name: 'update',
    async execute(message) {
        let allMembers;
        const seed = message.guild.roles.cache.find(role => role.id === id.seed);
        const sprout = message.guild.roles.cache.find(role => role.id === id.sprout);
        const seedling = message.guild.roles.cache.find(role => role.id === id.seedling);
        let seedCount = 0;
        let sproutCount = 0;
        let seedlingCount = 0;

        //try {
            allMembers = await profileModel.find({nickname: {$ne: null}});
            allMembers.forEach(async (current) => {
                const currUserId = current.userId;
                const currUser = await message.guild.members.cache.get(currUserId);

                if (current.level >=3) {
                    try {
                        await profileModel.findOneAndUpdate(
                            { userId: currUserId },
                            { $inc: { petals: -5 }}
                        )
                    } catch (e) {
                        console.log("kill me please");
                    }
                }

                if (current.level >=10) {
                    try {
                        await profileModel.findOneAndUpdate(
                            { userId: currUserId },
                            { $inc: { petals: -10 }}
                        )
                    } catch (e) {
                        console.log("kill me please");
                    }
                }


                /*if (current.level >= 3) {
                    if (!currUser.roles.cache.has(sprout)) {
                        try {
                            await profileModel.findOneAndUpdate(
                                { userId: currUserId },
                                { $inc: { petals: 5 } }
                            )
                            await currUser.roles.add(sprout);
                        } catch(e) {
                            console.log("Error adding sprout role: " + e.message);
                        }

                        const updateAch = current.ach;
                            if (!updateAch[12]) {
                                updateAch[12] = true;
                                try {
                                    await profileModel.findOneAndUpdate(
                                        { userId: currUserId },
                                        { $set: {ach: updateAch} },
                                    )
                                } catch(e) {
                                    console.log("Error adding sprout achievement: " + e.message);
                                }
                            }
                            sproutCount ++;

                    }
                }

                if (current.level >= 10) {
                    if (!currUser.roles.cache.has(seedling)) {
                        try {
                            await profileModel.findOneAndUpdate(
                                { userId: currUserId },
                                { $inc: { petals: 10 } }
                            )
                            await currUser.roles.add(seedling);
                        } catch(e) {
                            console.log("Error adding seedling role: " + e.message);
                        }

                        const updateAch = current.ach;
                            if (!updateAch[13]) {
                                updateAch[13] = true;
                                try {
                                    await profileModel.findOneAndUpdate(
                                        { userId: currUserId },
                                        { $set: {ach: updateAch} },
                                    )
                                } catch(e) {
                                    console.log("Error adding seedling achievement: " + e.message);
                                }
                            }
                        seedlingCount ++;
                    }
                }


            })
        } catch(e) {
            console.log("Error updating all level rewards: " + e.message)
        }*/

    })

}
    
}
