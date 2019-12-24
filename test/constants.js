

module.exports = {
  get requiredAuctionAdapterCreatorStructure() {
    return {
      create: async () => ({}),
      findByIdAndUpdate: async () => ({}),
      findOneAndUpdate: async () => ({}),
      update: async () => [],
      find: async () => [],
      findOne: async () => ({}),
      findById: async () => ({}),
    };
  },
  get validPaginationObject() {
    return {
      page: 1,
      items_per_page: 5,
    };
  },
};