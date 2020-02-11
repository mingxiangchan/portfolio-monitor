import React, {useEffect} from 'react'
import {Form, Input, InputNumber, Switch, Modal, message} from 'antd'
import {ModalUpdateFormProps, AccUpdateFormData} from '../types'
import {doPut} from '../utils/http'

const {TextArea} = Input

const formOpts = {
  name: "accUpdateForm"
}

const formItemlayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
}

const AccUpdateForm = Form.create<ModalUpdateFormProps>(formOpts)(
  ({form, visible, setVisible, acc}: ModalUpdateFormProps) => {
    const setInitial = () => {
      const {name, deposit_usd, deposit_btc, notes} = acc
      form.setFieldsValue({
        name,
        deposit_btc: deposit_btc / 100000000,
        deposit_usd: deposit_usd / 100,
        notes
      })
    }

    useEffect(() => {
      setInitial()
    }, [])

    const {getFieldDecorator} = form

    const handleSubmit = () => {
      form.validateFields((err, values: AccUpdateFormData) => {
        if (err) {
          message.error("Fix the form errors before submitting please.")
          return
        }

        const updatedData = {
          ...values,
          deposit_usd: Math.floor(values.deposit_usd * 100),
          deposit_btc: Math.floor(values.deposit_btc * 100000000),
        }

        doPut(`/api/bitmex_accs/${acc.id}`, {bitmex_acc: updatedData}, _resp => {
          message.success(`Updated Bitmex Acc: ${values.name}`)
          form.resetFields();
          setInitial()
          setVisible(false);
        })
      });
    }

    const handleCancel = () => {
      form.resetFields();
      setInitial()
      setVisible(false);
    };

    return (
      <Modal
        title="Update BitMex Account"
        visible={visible}
        okText="Update"
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={720}
      >
        <Form {...formItemlayout}>

          <Form.Item label="Account Name">
            {
              getFieldDecorator('name', {
                rules: [{required: true, message: 'Please input the account name'}],
              })(<Input autoFocus />)
            }
          </Form.Item>

          <Form.Item label="Is this Testnet" wrapperCol={{span: 1}}>
            {getFieldDecorator('is_testnet', {valuePropName: "checked", initialValue: true})(<Switch />)}
          </Form.Item>

          <Form.Item label="API Key">
            {getFieldDecorator('api_key', {})(<Input />)}
          </Form.Item>

          <Form.Item label="API Secret">
            {getFieldDecorator('api_secret', {})(<Input />)}
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

export default AccUpdateForm
