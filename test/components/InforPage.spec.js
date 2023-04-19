import { mount } from '@vue/test-utils';
import InforPage from '@/components/InforPage.vue';
import 'element-plus/theme-chalk/index.css';
import ElementPlus, {ElButton, ElInput, ElScrollbar} from "element-plus";

jest.mock('element-plus/theme-chalk/index.css', () => ({
    __esModule: true,
    default: '',
}));

describe('InforPage.vue', () => {
    // 用户信息的测试数据
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        campus: 'A Campus',
        grade: '1st Grade',
        description: 'A short description',
        gender: '男',
    };

    test('renders the initial state', () => {
        const wrapper = mount(InforPage, {
            data() {
                return {
                    user,
                };
            },
        });

        // 检查页面上的元素是否按预期渲染
        // ...
    });

    test('opens and closes the edit dialog', async () => {
        const wrapper = mount(InforPage, {
            data() {
                return {
                    user,
                    editVisible: false,
                };
            },
        });

        const editButton = wrapper.find('el-button');
        await editButton.trigger('click');
        expect(wrapper.vm.editVisible).toBe(true);

        const cancelButton = wrapper.find('.dialog-footer > el-button');
        await cancelButton.trigger('click');
        expect(wrapper.vm.editVisible).toBe(false);
    });

    // 更多测试...
});