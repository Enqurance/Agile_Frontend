// test/components/Counter.spec.js
import {mount} from "@vue/test-utils";
import PlaceSearch from "@/components/PlaceSearch.vue";
import 'element-plus/theme-chalk/index.css';
import ElementPlus, {ElButton, ElInput, ElScrollbar} from "element-plus";

jest.mock('element-plus/theme-chalk/index.css', () => ({
    __esModule: true,
    default: '',
}));

describe("PlaceSearch.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(PlaceSearch, {
            global: {
                plugins: [ElementPlus],
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    // 初始化状态测试
    it('renders without crashing', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('calls sub_p_id method when search button is clicked', async () => {
        const input = wrapper.findComponent(ElInput);
        expect(input.exists()).toBe(true);
        const button = wrapper.findComponent(ElButton);
        expect(button.exists()).toBe(true);

        const spy = jest.spyOn(wrapper.vm, 'sub_p_id');
        await button.trigger('click');
        expect(spy).toHaveBeenCalled();
    })
    ;

    //测试搜索结果正确性
    it('displays search results containing "食堂" when searching for "食堂"', async () => {
        // 在搜索框中输入 "食堂"
        const input = wrapper.findComponent(ElInput);
        await input.setValue('食堂');

        // 点击搜索按钮
        const button = wrapper.findComponent(ElButton);
        await button.trigger('click');

        // 等待搜索结果更新
        await wrapper.vm.$nextTick();

        // 检查搜索结果中的每一项，确认它们都包含 "食堂"
        const searchResults = wrapper.findAll('.max_length span');
        searchResults.forEach((result) => {
            expect(result.text()).toContain('食堂');
        });
    });

    //测试少结果时隐藏滚动条
    // it('hides the scrollbar component when there are few search results', async () => {
    //     // Set search results to a small number
    //     await wrapper.setData({ search_result_num: 3 });
    //
    //     const scrollbar = wrapper.findComponent(ElScrollbar);
    //     expect(scrollbar.isVisible()).toBe(false);
    // });
    //
    // //测试多结果时出现滚动条
    // it('displays the scrollbar component when there are many search results', async () => {
    //     // Set search results to a small number
    //     await wrapper.setData({ search_result_num: 10 });
    //
    //     const scrollbar = wrapper.find('el-scrollbar-stub');
    //     expect(scrollbar.isVisible()).toBe(true);
    // });
});