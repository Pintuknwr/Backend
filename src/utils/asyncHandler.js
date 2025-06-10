export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    }
}






// // This function is used to handle asynchronous errors in Express routes (Higher Order Function)
// const asyncHandler = (fn) => async (req,res,next) =>{
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(error.status || 500).json({
//
//             success: false,
//             message : error.message 
//         });
//         next(error);
//     }
// }
