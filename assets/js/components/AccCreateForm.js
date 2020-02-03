import React from 'react'
import { Form, Input, Switch, Button, Typography } from 'antd'

const { Title } = Typography

const {TextArea} = Input

const AccCreateForm = ({form}) => {
  const { getFieldDecorator } = form

  const formItemlayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12},
  }

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // submit data to backend here

      form.resetFields();
    });
  }

  return (
    <>
      <Title>Create BitMex Account</Title>
      <Form onSubmit={handleSubmit} {...formItemlayout}>

        <Form.Item label="Name this Account">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input the account name' }],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Is this Testnet" wrapperCol={{span: 1}}>
          {getFieldDecorator('isTestnet', {})(<Switch />)}
        </Form.Item>

        <Form.Item label="API Key">
          {getFieldDecorator('apiKey', {
            rules: [{ required: true}],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="API Secret">
          {getFieldDecorator('apiSecret', {
            rules: [{ required: true}],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Deposit (USD)">
          {getFieldDecorator('depositUsd', {
            rules: [{ required: true}],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Deposit (BTC)">
          {getFieldDecorator('depositBtc', {
            rules: [{ required: true}],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Notes">
          {getFieldDecorator('notes', {
            rules: [{ required: true}],
          })(<TextArea rows={5}/>)}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default Form.create({name: 'accCreateForm'})(AccCreateForm)
