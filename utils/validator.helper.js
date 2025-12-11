const validatorHelper = {
  checkIsDuplicated: async (Model, fields, excludeId = null, mode = "OR") => {
    if (!fields || fields.length === 0) return false;

    let query = {};

    if (mode === "AND") {
      // AND mode: Tất cả field phải đúng cùng lúc
      fields.forEach((f) => {
        query[f.key] = f.value;
      });
    } else {
      // OR mode: Chỉ cần 1 field trùng (DEFAULT)
      query.$or = fields.map((f) => ({ [f.key]: f.value }));
    }

    // Bỏ qua document có id này (dùng cho update)
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const count = await Model.countDocuments(query).exec();
    return count > 0;
  },
};

export default validatorHelper;
