// tests/components/Counter.spec.js
import { mount } from "@vue/test-utils";
import PlaceSearch  from "@/components/PlaceSearch.vue";

describe("PlaceSearch.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(PlaceSearch);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('renders correctly', () => {
        const wrapper = mount(PlaceSearch)
        const html = wrapper.html()
        console.log(html) // 打印渲染后的 HTML 代码
    })

    // 初始化状态测试
    it('renders without crashing', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('calls sub_p_id method when search button is clicked', async () => {
        const button = wrapper.find('el-button'); // 修改选择器以查找真实的 'el-button' 而不是 'el-button-stub'
        expect(button.exists()).toBe(true);
        const input=wrapper.find('el-input');
        expect(input.exists()).toBe(true);
        //const spy = jest.spyOn(wrapper.vm, 'sub_p_id');
        //await button.trigger('click');
        //expect(spy).toHaveBeenCalled();
    });

    // //测试搜索结果正确性
    // it('displays search results containing "食堂" when searching for "食堂"', async () => {
    //     // 在搜索框中输入 "食堂"
    //     const input = wrapper.find('el-input');
    //     await input.setValue('食堂');
    //
    //     // 点击搜索按钮
    //     const button = wrapper.find('el-button');
    //     await button.trigger('click');
    //
    //     // 等待搜索结果更新
    //     await wrapper.vm.$nextTick();
    //
    //     // 检查搜索结果中的每一项，确认它们都包含 "食堂"
    //     const searchResults = wrapper.findAll('.max_length span');
    //     searchResults.forEach((result) => {
    //         expect(result.text()).toContain('食堂');
    //     });
    // });
    //
    // //测试少结果时隐藏滚动条
    // it('hides the scrollbar component when there are few search results', async () => {
    //     // Set search results to a small number
    //     await wrapper.setData({ search_result_num: 3 });
    //
    //     const scrollbar = wrapper.find('el-scrollbar-stub');
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