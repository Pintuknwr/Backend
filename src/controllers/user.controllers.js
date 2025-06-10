import {asyncHandler} from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
    // Registration logic here
    return res.status(200).json({
        message: "Registration successful",
    });
}
);

export {registerUser};


