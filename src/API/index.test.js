import mockAxios from 'axios';
import {createAlbum, findAlbums} from './index';

describe('Create Album', () => {
    const albumId = '1234';
    beforeEach(async () => {
        // setup
        const album = { title: 'Birthday' };
        return mockAxios.post.mockImplementationOnce(() =>
            Promise.resolve({
                data: { ...album, id: albumId }
            })
        );
    });

    it('should create new album', async () => {
        const album = await createAlbum();
        expect(album.id).toEqual(albumId);
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
    });
});

describe('Find Albums', () => {
    const albumId = '1234';
    beforeEach(async () => {
        // setup
        const album = { title: 'Birthday' };
        return mockAxios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: [{ ...album, id: albumId }]
            })
        );
    });

    it('should create new album', async () => {
        const album = await findAlbums();
        expect(album).toHaveLength(1)
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });
});