import { mount } from '@vue/test-utils'
import NewPost from "@/components/pc/sub_components/NewPost.vue"
import axios from "@/axios/axios.js"
import cookies from 'vue-cookies'

describe('NewPost', () => {

    // 帖子标题不能为空
    it('should return error if post_title is empty', async () => {
        const wrapper = mount(NewPost)
        wrapper.setData({ formData: { post_title: '', post_body: 'test', pin_type: 1 } })
        const mockMessage = { error: jest.fn() }
        wrapper.vm.$message = mockMessage
        wrapper.vm.submitForm()
        expect(mockMessage.error).toHaveBeenCalledWith('帖子标题不能为空')
    })

    // 帖子正文不能为空
    it('should return error if post_body is empty', async () => {
        const wrapper = mount(NewPost)
        wrapper.setData({ formData: { post_title: 'test', post_body: '', pin_type: 2 } })
        const mockMessage = { error: jest.fn() }
        wrapper.vm.$message = mockMessage
        wrapper.vm.submitForm()
        expect(mockMessage.error).toHaveBeenCalledWith('帖子正文不能为空')
    })

    // 帖子正文不能为空
    it('should return error if post_body is empty', async () => {
        const wrapper = mount(NewPost)
        wrapper.setData({ formData: { post_title: 'test', post_body: 'test' } })
        const mockMessage = { error: jest.fn() }
        wrapper.vm.$message = mockMessage
        wrapper.vm.submitForm()
        expect(mockMessage.error).toHaveBeenCalledWith('类别不能为空')
    })

     // 帖子正文不能为空
    it('should return error if post_body is empty', async () => {
        const wrapper = mount(NewPost, {
            global: {
                mocks: {
                    $axios: axios,
                    $cookies : cookies
                }
            }
        })
        wrapper.setData({ formData: { post_title: 'test', post_body: 'test' , pin_type: 2} })
        wrapper.vm.submitForm()
    })
})