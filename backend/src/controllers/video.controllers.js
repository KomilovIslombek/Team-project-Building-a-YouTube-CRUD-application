import {
    deleteOwnedVideo,
    findAllVideos,
    findOwnedVideo,
    findUserVideos,
    insertVideo,
    updateOwnedVideo,
} from "../services/video.service.js"
import { buildVideoName, removeVideo, saveVideo } from "../utils/video.js"
import { AppError } from "../utils/appError.js"

const getVideoId = (id) => {
    const videoId = Number(id)
    if (!Number.isSafeInteger(videoId) || videoId < 1) {
        throw new AppError("Invalid video id", 400)
    }
    return videoId
}

const removeUploadedVideo = async (name, originalError) => {
    try {
        await removeVideo(name)
    } catch (cleanupError) {
        throw new AggregateError(
            [originalError, cleanupError],
            "Video update failed and the uploaded file could not be removed"
        )
    }
}

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
    let { title } = req.body
    let user_id = req.user.id
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

export const updateVideo = async (req, res) => {
    const id = Number(req.params.id)
    const file = req.files?.file

    const existingVideo = await findOwnedVideo(id, req.user.id)
    if (!existingVideo) throw new AppError("Video not found", 404)

    let replacementName
    if (file) {
        replacementName = buildVideoName(file)
        await saveVideo(file, replacementName)
    }

    let video
    try {
        video = await updateOwnedVideo({
            id,
            userId: req.user.id,
            title: req.body.title,
            url: replacementName,
        })
    } catch (error) {
        if (replacementName) await removeUploadedVideo(replacementName, error)
        throw error
    }

    if (!video) {
        const notFound = new AppError("Video not found", 404)
        if (replacementName) await removeUploadedVideo(replacementName, notFound)
        throw notFound
    }

    if (replacementName) await removeVideo(existingVideo.url)

    return res.status(200).json({
        status: 200,
        message: "Video updated successfully",
        data: video,
    })
}

export const deleteVideo = async (req, res) => {
    const id = getVideoId(req.params.id)
    const video = await deleteOwnedVideo(id, req.user.id)
    if (!video) throw new AppError("Video not found", 404)

    await removeVideo(video.url)

    return res.status(200).json({
        status: 200,
        message: "Video deleted successfully",
        data: video,
    })
}