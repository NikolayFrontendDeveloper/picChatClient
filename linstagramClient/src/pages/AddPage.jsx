import { useState } from "react";
import axios from 'axios';
import s from "./styles.module.scss"

export default function AddPage({ uploadPost }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [text, setText] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setPreviewUrl('');
        }
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'vby5plvu'); // replace with your upload preset

        setUploading(true);

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/da1h0vrzb/image/upload', // replace with your Cloudinary cloud name
                formData
            );
            const payload = {
                user: localStorage.getItem('id'),
                text: text,
                imageUrl: response.data.secure_url
            };
            uploadPost(payload);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={s.container}>
            <h1>Add</h1>
            <div>
                <form onSubmit={handleUpload}>
                    <input className={s.file_handler} type="file" onChange={handleFileChange} />
                    {previewUrl && (
                        <div>
                            <p className={s.purple_text}>Selected Image:</p>
                            <img src={previewUrl} alt="Selected file" style={{ maxWidth: '100%' }} />
                        </div>
                    )}
                    <div className={s.form__group}>
                        <input type="input" className={s.form__field} placeholder="Text" name="text" id='name' value={text} onChange={handleTextChange} />
                        <label htmlFor="text" className={s.form__label}>Text</label>
                    </div>
                    <button className={s.purple_button} type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>
        </div>
    )
}
