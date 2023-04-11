import {mount} from "@vue/test-utils";
import MapPinInfo from "@/components/MapPinInfo";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

mock.onPost('/map/pin/changePinInfoById').reply(200, {
    success: true,
    message: 'Data updated successfully',
});

describe("MapPinInfo.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(MapPinInfo);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    // 初始化状态测试
    it('renders without crashing', () => {
        expect(wrapper.exists()).toBe(true);
    });

    // it('updates data correctly', async () => {
    //     // Set initial data
    //     const initialData = { id: 1, title: 'Old title', content: 'Old content' };
    //     await wrapper.setData({ form: initialData });
    //
    //     // Modify data in the component
    //     const updatedData = { ...initialData, title: 'New title', content: 'New content' };
    //     await wrapper.setData({ form: updatedData });
    //
    //     // Call the updateData method
    //     const spy = jest.spyOn(wrapper.vm, 'updateData');
    //     await wrapper.vm.updateData();
    //
    //     // Check if the updateData method was called
    //     expect(spy).toHaveBeenCalled();
    //
    //     // Check if the request was made with the correct data
    //     const lastPutRequest = mock.history.put[mock.history.put.length - 1];
    //     expect(JSON.parse(lastPutRequest.data)).toEqual(updatedData);
    // });
});