const validatorHelper = {
  checkIsDuplicated: async (Model, fields, excludeId = null) => {
    if (!fields || fields.length === 0) return false;

    // Tạo mảng $or query
    const orConditions = fields.map((f) => ({ [f.key]: f.value }));

    const query = { $or: orConditions };
    if (excludeId) {
      query._id = { $ne: excludeId }; // bỏ qua document có id này
    }

    const count = await Model.countDocuments(query).exec();
    return count > 0;
  },
};

export default validatorHelper;
