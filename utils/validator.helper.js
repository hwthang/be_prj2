const validatorHelper = {
  checkDuplicatedKey: async (modelName, keyName, value) => {
    try {
      if (value == null || value == '') return false;
      const isDuplicated = await modelName.findOne({ [keyName]: value });
      if (isDuplicated) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

export default validatorHelper;
