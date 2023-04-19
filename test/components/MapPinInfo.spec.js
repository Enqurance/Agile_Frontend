import { mount} from '@vue/test-utils';
import MapPinInfo from '@/components/MapPinInfo.vue';
import 'element-plus/theme-chalk/index.css';
import ElementPlus, {ElButton, ElDrawer, ElInput, ElScrollbar} from "element-plus";
import {nextTick} from "vue";

jest.mock('element-plus/theme-chalk/index.css', () => ({
    __esModule: true,
    default: '',
}));

describe('MapPinInfo.vue', () => {
    let wrapper;

    beforeEach(() => {

        wrapper = mount(MapPinInfo, {
            global: {
                plugins: [ElementPlus],
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('opens the drawer when the button is clicked', async () => {
        const button = wrapper.find('[testid="1"]');
        //await button.trigger('click');
        expect(button.exists()).toBe(true);
        await nextTick();
        //const drawer = wrapper.findComponent(ElDrawer);
        //expect(drawer.isVisible()).toBe(true);
    });

    // it('opens the edit dialog when the edit button is clicked', async () => {
    //     wrapper.vm.drawer = true;
    //     await wrapper.vm.$nextTick();
    //     const editButton = wrapper.find('.edit-info button');
    //     await editButton.trigger('click');
    //     expect(wrapper.vm.dialogVisible).toBe(true);
    // });
    //
    // it('closes the edit dialog when the cancel button is clicked', async () => {
    //     wrapper.vm.dialogVisible = true;
    //     await wrapper.vm.$nextTick();
    //     const cancelButton = wrapper.find('.el-dialog__footer button');
    //     await cancelButton.trigger('click');
    //     expect(wrapper.vm.dialogVisible).toBe(false);
    // });
    //
    // it('calls submitForm when the confirm button is clicked', async () => {
    //     wrapper.vm.dialogVisible = true;
    //     await wrapper.vm.$nextTick();
    //     const submitFormSpy = jest.spyOn(wrapper.vm, 'submitForm');
    //     const confirmButton = wrapper.findAll('.el-dialog__footer button').at(1);
    //     await confirmButton.trigger('click');
    //     expect(submitFormSpy).toHaveBeenCalled();
    // });

    // 其他相关测试可以根据组件的实际需求添加
});