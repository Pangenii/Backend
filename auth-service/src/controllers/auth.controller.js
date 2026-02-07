import logger from "../utils/logger";
import User from "../models/User.model";
import { validateRegisterInput } from "../utils/validation";

//USER REGISTRATION
export const register = async (req, res) => {
    logger.info("Register Endpoint hit");
    try {
        //VALIDATE
        const { error } = validateRegisterInput(req.body);
        if (error) {
            logger.warn("Validation Error", error.details[0].message);
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }
        const { username, email, password } = req.body;
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            logger.warn("User with this credentials is already registered.")
            return res.status().json({
                success: false,
                message: "User with this credentials is already registered."
            })
        }
        user = new User({ username, email, password });
        await user.save();
        logger.info("User registered successfully.")
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
//USER LOGIN

//REFRESH TOKEN

//LOGIN


//FORGOT PASSWORD

//RESET PASSWORD