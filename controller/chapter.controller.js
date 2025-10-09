import chapterService from "../service/chapter.service.js"

class ChapterController {
  createNewChapter=async(req, res)=>{
    const input = req.body
    const result = await chapterService.createNewChapter(input)
    res.send(result)
  }
}

export default new ChapterController()