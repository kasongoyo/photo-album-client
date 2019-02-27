const axios = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    create: () => axios,
    defaults: {
        adapter: {},
        baseUrl:''
    },
};

export default axios;