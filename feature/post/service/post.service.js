import Chapter from "../../chapter/model/chapter.model.js";
import Comment from "../../comment/model/comment.model.js";
import Document from "../../document/model/document.model.js";
import Event from "../../event/model/event.model.js";
import Like from "../../like/model/like.model.js";
import Member from "../../member/model/member.model.js";
import Post from "../model/post.model.js";


class PostService {
  createNewPost = async (input) => {
    try {
      const newPost = new Post({
        title: input?.title,
        type: input?.type,
      });

      await newPost.save();

      switch (input?.type) {
        case "document": {
          let currentDocument = await Document.findByIdAndUpdate(
            input?.objectId,
            { postId: newPost._id }
          );

          currentDocument = await Document.findById(input?.objectId);

          return currentDocument;
        }
        case "event": {
          let currentEvent = await Event.findByIdAndUpdate(input?.objectId, {
            postId: newPost._id,
          });

          currentEvent = await Event.findById(input?.objectId);

          return currentEvent;
        }
      }
    } catch (error) {
      console.log(error);
      return "Lỗi khi tạo bài đăng";
    }
  };

  likePost = async (input) => {
    try {
      let isAccountHasLikedPost = await Like.findOne({
        accountId: input?.accountId,
        postId: input?.postId,
      });

      if (isAccountHasLikedPost) {
        isAccountHasLikedPost.hasLiked = true;
        await isAccountHasLikedPost.save();
      }

      const newLike = new Like({
        postId: input?.postId,
        accountId: input?.accountId,
        hasLiked: true,
      });

      await newLike.save();

      await Post.findByIdAndUpdate(input?.postId, { $inc: { likes: 1 } });

      return newLike;
    } catch (error) {
      console.log(error);
      return "Lỗi khi thích bài đăng";
    }
  };
  unlikePost = async (input) => {
    try {
      const updatedLike = await Like.findByIdAndUpdate(
        input?.likeId,
        { hasLiked: false },
        { new: true }
      );
      await Post.findByIdAndUpdate(input?.postId, { $inc: { likes: -1 } });
      return updatedLike;
    } catch (error) {
      console.log(error);
      return "Lỗi khi hủy thích bài đăng";
    }
  };

  commentPost = async (input) => {
    try {
      const newComment = new Comment({
        postId: input?.postId,
        accountId: input?.accountId,
        comment: input?.comment,
      });

      await newComment.save();
      await Post.findByIdAndUpdate(input?.postId, { $inc: { comments: 1 } });
      return newComment;
    } catch (error) {
      console.log(error);
      return "Lỗi khi bình luận bài đăng";
    }
  };

  reportComment = async (id) => {
    try {
      const reportedComment = await Comment.findByIdAndUpdate(
        id,
        { $inc: { reports: 1 } },
        { new: true }
      );
      return reportedComment;
    } catch (error) {
      console.log(error);
      return "Lỗi khi báo cáo bình luận bài đăng";
    }
  };

  getAllComments = async (input) => {
    try {
      // 1. Lấy comment + account trước
      let comments = await Comment.find().populate("accountId"); // lấy account để biết id + type

      if (input?.postId) {
        comments = comments.filter((cmt) => cmt.postId == input.postId);
      }

      // 2. Lấy tất cả accountId có trong comment
      const accountIds = comments.map((c) => c?.accountId?._id).filter(Boolean);

      // 3. Query Member & Chapter
      const members = await Member.find({
        accountId: { $in: accountIds },
      }).populate("accountId");

      const chapters = await Chapter.find({
        accountId: { $in: accountIds },
      }).populate("accountId");

      // 4. Trộn dữ liệu vào comment
      const result = comments.map((comment) => {
        const accId = comment.accountId?._id?.toString();

        const member = members.find((m) => m.accountId._id.toString() === accId);

        const chapter = chapters.find((c) => c.accountId._id.toString() === accId);

        let author = {
          type: null,
          name: null,
          avatar: null,
        };

        if (member) {
          author = {
            type: "member",
            name: member.fullName,
            avatar: member?.accountId?.avatar || null,
          };
        } else if (chapter) {
          author = {
            type: "chapter",
            name: chapter.name,
            avatar: chapter?.accountId?.avatar || null,
          };
        }

        return {
          ...comment.toObject(),
          author,
        };
      });

      return result;
    } catch (error) {
      console.log(error);
      return "Lỗi khi lấy danh sách bình luận";
    }
  };
}

export default new PostService();
