import React, { useState, ChangeEvent } from "react";
import { Button, Box, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import Joi from '@hapi/joi';
import { joiResolver } from "@hookform/resolvers/joi";
import axios from 'axios';

const validationSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
});

interface PublishFormInput {
    title: string;
    description: string;
}

const PublishYourGameForm: React.FC = () => {

    const { control, register, handleSubmit, formState: { errors } } = useForm<PublishFormInput>(
        { resolver: joiResolver(validationSchema), }
    );

    // Upload files
    const [files, setFiles] = useState<File[]>([]);
    const [convertedFiles, setConvertedFiles] = useState<string[]>([]);


    const onSubmit = async (data: PublishFormInput) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            axios
                .post('http://httpbin.org/post', formData)
                .then((response) => {
                    console.log(response.data);
                    // Handle success or redirect to a different page
                })
        }
        catch (error) {
            console.error("Error uploading files:", error);
            // Handle error
        };
        console.log(formData);
    };

    /* const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            setFiles(Array.from(selectedFiles));
        }
    }; */

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const fileArray: File[] = Array.from(selectedFiles);
            const convertedFiles: Promise<string>[] = fileArray.map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (ev: ProgressEvent<FileReader>) => {
                        resolve(ev.target?.result as string);
                    };
                });
            });

            Promise.all(convertedFiles).then((base64Array) => {
                setConvertedFiles(base64Array);
                setFiles(fileArray);
            });
        }
    };

    const classes = useStyles();

    return (<Box className={classes.container}>
        <div className={classes.logo}>
            <img src={"/iceLogo.png"} className="h-8 mr-3" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                ICE
            </span>
        </div>

        <Typography variant="h5" className={classes.header}>Publish Your New Game</Typography>

        <form onSubmit={handleSubmit(onSubmit)} className={classes.form} >

            <TextField
                className={classes.textFieldRoot}
                required={true}
                variant="outlined"
                label="Title"
                {...register("title")}
                error={!!errors.title}
                helperText={errors.description && "Title is required"}
                fullWidth={true}
            />

            <TextField
                className={classes.textFieldRoot}
                required={true}
                variant="outlined"
                label="Description"
                {...register("description")}
                error={!!errors.title}
                helperText={errors.description && "Description is required"}
                fullWidth={true}
            />

            <Typography variant="subtitle1">Please choose a file(s) to be uploded</Typography>

            <input
                required={true}
                type="file"
                multiple
                onChange={handleFileChange}
            />
            {/* Render the converted files */}
            {convertedFiles.length > 0 && (
                <>
                    {convertedFiles.map((fileBase64, index) => (
                        <div key={index}>
                            {fileBase64.indexOf("image/") > -1 && (
                                <img src={fileBase64} alt={`Uploaded Image ${index + 1}`} />
                            )}

                            {fileBase64.indexOf("video/") > -1 && (
                                <video controls>
                                    <source src={fileBase64} type={files[index].type} />
                                </video>
                            )}

                            {fileBase64.indexOf("audio/") > -1 && (
                                <audio controls>
                                    <source src={fileBase64} type={files[index].type} />
                                </audio>
                            )}

                            {fileBase64.indexOf("application/pdf") > -1 && (
                                <embed src={fileBase64} type={files[index].type} width="500" height="600" />
                            )}

                            {fileBase64.indexOf("application/zip") > -1 && (
                                <a href={fileBase64} download>
                                    Download Zip
                                </a>
                            )}

                            <Typography variant="caption">{files[index].name}</Typography>
                        </div>
                    ))}
                </>
            )}

            <Box className={classes.buttonWrapper}>
                <Button className={classes.button} fullWidth={true} type="submit" variant="contained" color="primary">
                    Upload
                </Button>
            </Box>
        </form>
    </Box>
    )
};

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        maxWidth: '600px',
        marginTop: '0px',
        marginBottom: '0px',
        marginLeft: '20%',
        //backgroundColor: '#202020',
        padding: '20px 10px',
        flexDirection: 'column'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
    },
    header: {
        color: '#595959',
        textAlign: 'center',
        margin: '10px',
        width: '100%',
        textTransform: 'capitalize'
    },
    divider: {
        width: "100%",
        backgroundColor: "light",

    },
    form: {
        maxwith: '380px',
        width: '100%',
        marginTop: '10px'
    },
    textFieldRoot: {
        height: '60px',
        color: '#565252',
        '& .MuiInputBase-root': {
            //color: 'rgba(255, 255, 255, 0.72)'
            color: 'black'
        },
        '& label': {
            borderColor: 'rgba(255, 255, 255, 0.72)',
            color: '#565252'
        },
        '& .MuiIconButton-root': {
            //color: 'rgba(255, 255, 255, 0.72)'
            color: '#565252'
        },
        '& .MuiInputLabel-asterisk': {
            //color: 'rgba(255, 255, 255, 0.72)'
            color: '#FFA640'
        }
    },
    buttonWrapper: {
        width: '100%',
        maxWidth: '100%',
        marginTop: '10px'
    },
    button: {
        minHeight: '40px',
        color: '#565252',
        //backgroundColor: '#0074E4',
        backgroundColor: '#B5C2E3',
        '&:hover': {
            //backgroundColor: 'rgb(40, 138, 232)'
            backgroundColor: '#7E95CD',
        }
    },
})

export default PublishYourGameForm;