import {useEffect, useState } from "react";
import { apis } from "@/apis";
import {
  Button,
  Flex,
  Form,
  Upload,
  Row,
  type UploadProps,
} from "antd";
import {UploadOutlined } from "@ant-design/icons";


const Resume = () => {

  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<Array<any>>([]);


  useEffect(() => {
    form.setFieldsValue({ total: '0.00' });
  }, [form]);

  

  const handleOk = async () => {

    form.validateFields().then(async (values) => {
      var attachedlink;

      if (values.uploadfile && values.uploadfile.fileList.length > 0) {


        const logoFile = values.uploadfile.fileList[0].originFileObj;
        const formData = new FormData();
        formData.append("file", logoFile);
        try {
          const uploadResponse: any = await apis.UploadFile(formData);
          console.log("Upload Result:", uploadResponse);
    
          if (uploadResponse.success) {
            const pdfPath = uploadResponse.path;
            attachedlink = pdfPath;
            console.log("pdf path", pdfPath)
          } else {
            values.uploadfile = undefined;
          }
        } catch (error) {
          console.error("File upload failed:", error);
          values.uploadfile = undefined;
        }
      }
    }
    )
  }
const handleProcessing = async() =>{
  console.log("processing")
  const resd = await apis.ProcessingPDF("test")
  console.log("result", resd)
}

  const handlePhotoChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => setFileList(newFileList);

  return (
    <>
      <Flex justify="center" align="center">
        <Row>
          <Form form={form} layout="vertical">
                <Form.Item  name="uploadfile">
                    <Upload
                      beforeUpload={() => false}
                      maxCount={1}
                      showUploadList={{ showPreviewIcon: false }}
                      onChange={handlePhotoChange}
                      fileList={fileList}
                    >
                      <Button>
                        <UploadOutlined />
                        Upload
                      </Button>
                    </Upload>
                  </Form.Item>
          </Form>
          <Button onClick={handleOk}>Start</Button>
          <Button onClick={handleProcessing}>Processing</Button>
        </Row>
      </Flex>

    </>
  );
};

export default Resume;

