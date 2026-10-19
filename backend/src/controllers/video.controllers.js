import { findAllVideos, findUserVideos, insertVideo } from "../services/video.service.js"
import { buildVideoName, saveVideo } from "../utils/video.js"

export const getVideos = async (req, res) => {
    let videos = await findAllVideos()

    res.status(200).json({
        status: 200,
        message: 'Videos fetched successfully',
        data: videos
    })
}

export const getVideosByUserId = async (req, res) => {
    let { id } = req.params;
    
    if(!id || !isFinite(id)) {
        return  res.status(400).json({
            status: 400,
            message: 'Invalid id'
        })
    } 

    let userVideos = await findUserVideos(id)
    return res.status(200).json({
        status: 200,
        message: `${id} User's videos fetched successfully`,
        data: userVideos,
    })
}

export const createVideo = async (req, res) => {
    let { title, user_id } = req.body
    let file = req?.files?.file

    let videoName = buildVideoName(file)
    
    let video = await insertVideo({title, user_id, url: videoName})
    if(video) await saveVideo(file, videoName);

    return res.status(201).json({
        status: 201,
        message: 'Video created efficiently',
        data: video
    })
}