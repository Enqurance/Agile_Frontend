import { mount } from '@vue/test-utils'
import NewPost from "@/components/sub_components/NewPost.vue"

describe('MapPinAdd', () => {

    // 帖子标题不能为空
    it('should return error if post_title is empty', async () => {
        const wrapper = mount(NewPost)
        wrapper.setData({ formData: { post_title: '', post_body: 'test', pin_type: 1 } })
        const result = await wrapper.vm.validateForm()
        expect(result).toBe('帖子标题不能为空')
    })
})