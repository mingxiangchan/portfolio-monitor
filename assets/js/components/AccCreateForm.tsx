import React from 'react'
import {Form, Input, Switch, Modal} from 'antd'
import {ModalFormProps} from '../types'

const {TextArea} = Input

const formOpts = {
  name: "accCreateForm"
}

const AccCreateForm = Form.create<ModalFormProps>(formOpts)(
  ({form, visible, setVisible}: ModalFormProps) => {
    const {getFieldDecorator} = form

    const formItemlayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    }

    const handleSubmit = () => {
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        // submit data to backend here

        form.resetFields();
        setVisible(false);
      });
    }

    const handleCancel = () => {
      form.resetFields();
      setVisible(false);
    };

    return (
      <Modal
        title="Add New BitMex Account"
        visible={visible}
        okText="Submit"
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={720}
      >
        <Form {...formItemlayout}>

          <Form.Item label="Account Name">
            {getFieldDecorator('name', {
              rules: [{required: true, message: 'Please input the account name'}],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Is this Testnet" wrapperCol={{span: 1}}>
            {getFieldDecorator('isTestnet', {})(<Switch />)}
          </Form.Item>

          <Form.Item label="API Key">
            {getFieldDecorator('apiKey', {
              rules: [{required: true}],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="API Secret">
            {getFieldDecorator('apiSecret', {
              rules: [{required: true}],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Deposit (USD)">
            {getFieldDecorator('depositUsd', {
              rules: [{required: true}],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Deposit (BTC)">
            {getFieldDecorator('depositBtc', {
              rules: [{required: true}],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Notes">
            {getFieldDecorator('notes', {
              rules: [{required: true}],
            })(<TextArea rows={5} />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
)

export default AccCreateForm
