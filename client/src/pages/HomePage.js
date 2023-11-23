import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout';
import { Form, Input, Modal, Select, Table, message } from 'antd';
import axios from 'axios';
import Spinner from '../components/Spinner';

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(false);
  const [frequency, setFrequency] = useState(false);

  const columns = [
    {
      title: 'UserId',
      dataIndex: 'userid'
    },
    {
      title: 'Amount',
      dataIndex: 'amount'
    },
    {
      title: 'Type',
      dataIndex: 'type'
    },
    {
      title: 'Category',
      dataIndex: 'category'
    },
    {
      title: 'Reference',
      dataIndex: 'refrence'
    },
    {
      title: 'Description',
      dataIndex: 'description'
    },
    {
      title: 'Date',
      dataIndex: 'date'
    },
    {
      title: 'Actions',
      dataIndex: 'actions'
    }
  ];

  const getAllTransaction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/v1/transactions/get-transaction", { userid: user?._id });
      setLoading(false);
      setTransaction(res.data);
    } catch (error) {
      setLoading(false);
      message.error("Fetch Issue with transaction");
    }
  };

  useEffect(() => {
    getAllTransaction();
  }, [])

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      await axios.post("http://localhost:5000/api/v1/transactions/add-transaction", { ...values, userid: user?._id });
      setLoading(false);
      message.success("Transactions added successfully");
      setShowModal(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to add transaction");
    }
  };
  return (
    <Layout>
      {loading && <Spinner />}
      <div className='filters'>
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option>Last 1 Week</Select.Option>
            <Select.Option>Last 1 Month</Select.Option>
            <Select.Option>Last 1 Year</Select.Option>
            <Select.Option>Custom</Select.Option>
          </Select>
        </div>

        <div>
          <button className='btn btn-primary' onClick={() => setShowModal(true)}>Add new</button>
        </div>
      </div>

      <div className='content'>
        <Table columns={columns} dataSource={transaction} />
      </div>

      <Modal
        title='Add transaction'
        open={showModal}
        footer={false}
        onCancel={() => setShowModal(false)}
      >
        <Form layout='vertical' onFinish={handleSubmit}>
          <Form.Item label='Amount' name='amount'>
            <Input type='text' />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tex">TAX</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type='date' />
          </Form.Item>
          <Form.Item label="Refrence" name="refrence">
            <Input type='text' />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type='text' />
          </Form.Item>

          <div className='d-flex justify-content-end'>
            <button type='submit' className='btn btn-primary'>
              {" "}
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  )
}

export default HomePage