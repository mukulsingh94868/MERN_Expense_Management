import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout';
import { DatePicker, Form, Input, Modal, Select, Table, message } from 'antd';
import axios from 'axios';
import Spinner from '../components/Spinner';
import moment from 'moment';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import Analytics from '../components/Analytics';


const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState('all');
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/v1/transactions/delete-transaction/${record?._id}`,
        // { transacationId: record?._id }
      );
      setLoading(false);
      message.success('Transactions deleted successfully');
    } catch (error) {
      setLoading(false);
      error.message = 'Unable to delete'
      console.log('error', error);
    }
  };

  const columns = [
    {
      title: 'UserId',
      dataIndex: 'userid',
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
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined onClick={() => { setEditable(record); setShowModal(true) }} />
          <DeleteOutlined className='mx-2' onClick={() => handleDelete(record)} />
        </div>
      )
    }
  ];

  useEffect(() => {
    const getAllTransaction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setLoading(true);
        const res = await axios.post("http://localhost:5000/api/v1/transactions/get-transaction",
          {
            userid: user?._id,
            frequency,
            selectedDate,
            type
          });
        setLoading(false);
        setTransaction(res.data);
      } catch (error) {
        setLoading(false);
        message.error("Fetch Issue with transaction");
      }
    };

    getAllTransaction();
  }, [frequency, selectedDate, type])

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      if (editable) {
        await axios.put(`http://localhost:5000/api/v1/transactions/edit-transaction/${editable?._id}`, {
          payload: {
            ...values,
            userId: user?._id,
          },
          // transacationId: editable?._id
        });
        setLoading(false);
        message.success("Transactions Updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/v1/transactions/add-transaction", { ...values, userid: user?._id });
        setLoading(false);
        message.success("Transactions added successfully");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      console.log('error', error);
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
            <Select.Option value="7" >Last 1 Week</Select.Option>
            <Select.Option value="30" >Last 1 Month</Select.Option>
            <Select.Option value="365" >Last 1 Year</Select.Option>
            <Select.Option value="custom" >Custom</Select.Option>
          </Select>

          {frequency === 'custom' && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
            />
          )}
        </div>

        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all" >ALL</Select.Option>
            <Select.Option value="income" >INCOME</Select.Option>
            <Select.Option value="expense" >EXPENSE</Select.Option>
          </Select>
        </div>

        <div className='switch-icons'>
          <UnorderedListOutlined
            className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`}
            onClick={() => setViewData("analytics")}
          />
        </div>

        <div>
          <button className='btn btn-primary' onClick={() => setShowModal(true)}>Add new</button>
        </div>
      </div>

      <div className='content'>
        {viewData === 'table'
          ?
          <Table columns={columns} dataSource={transaction} />
          :
          <Analytics allTransaction={transaction} />}

      </div>

      <Modal
        title={editable ? 'Edit Transaction' : 'Add Transaction'}
        open={showModal}
        footer={false}
        onCancel={() => setShowModal(false)}
      >
        <Form layout='vertical' onFinish={handleSubmit} initialValues={editable}>
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