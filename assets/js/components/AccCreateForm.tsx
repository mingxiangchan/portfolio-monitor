import React from 'react'
import {Form, Input, InputNumber, Switch, Modal, message} from 'antd'
import {ModalFormProps, AccCreateFormData} from '../types'
import {doPost} from '../utils/http'

const {TextArea} = Input

const formOpts = {
  name: "accCreateForm"
}

const formItemlayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
}

const AccCreateForm = Form.create<ModalFormProps>(formOpts)(
  ({form, visible, setVisible}: ModalFormProps) => {
    const {getFieldDecorator} = form

    const handleSubmit = () => {
      form.validateFields((err, values: AccCreateFormData) => {
        if (err) {
          message.error("Fix the form errors before submitting please.")
          return
        }
        doPost("/api/bitmex_accs", {bitmex_acc: values}, resp => {
          message.success(`Added New Bitmex Acc: ${values.name}`)
          form.resetFields();
          setVisible(false);
        })
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
            })(<Input autoFocus />)}
          </Form.Item>

          <Form.Item label="Is this Testnet" wrapperCol={{span: 1}}>
            {getFieldDecorator('is_testnet', {valuePropName: "checked", initialValue: true})(<Switch />)}
          </Form.Item>

          <Form.Item label="API Key">
            {getFieldDecorator('api_key', {
              rules: [{required: true}],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="API Secret">
            {getFieldDecorator('api_secret', {
              rules: [{required: true}],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Deposit (USD)">
            {getFieldDecorator('deposit_usd', {
              rules: [{required: true}],
            })(<InputNumber min={0} precision={2} style={{width: '100%'}} />)}
          </Form.Item>

          <Form.Item label="Deposit (BTC)">
            {getFieldDecorator('deposit_btc', {
              rules: [{required: true}],
            })(<InputNumber min={0} precision={8} style={{width: '100%'}} />)}
          </Form.Item>

          <Form.Item label="Notes">
            {getFieldDecorator('notes', {})(<TextArea rows={5} />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
)

export default AccCreateForm
