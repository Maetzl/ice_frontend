import React, { useState } from "react";
import { TextField , Checkbox, Button, Box, FormControlLabel, IconButton, InputAdornment, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Link } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Joi from "@hapi/joi";
import { joiResolver } from "@hookform/resolvers/joi";


interface LoginFormProps {
    
}

interface LoginFormInput {
    email: string;
    password: string;
    rememberMe: boolean,
}

const validationSchema = Joi.object({
    email: Joi.string()
           .email({ tlds: { allow: false } })
           .required().label("Email"), //must be a valid email address
    password: Joi.string()
           .min(8)
           .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
           .required().label("Password"),
    rememberMe: Joi.boolean().optional(),
});

const LoginForm: React.FC = () => {
    const { control, handleSubmit, formState: { errors }} = useForm<LoginFormInput>({
        resolver: joiResolver(validationSchema)
    });

    const onSubmit: SubmitHandler<LoginFormInput> = data => {
        console.log(errors);
        console.log(data);
    }

    const [shouldShowPassword, setShouldShowPassword] = useState<boolean>(false);
    const classes = useStyles()

    const handleVisibility = () => {
        setShouldShowPassword(prevValue => !prevValue)
    }

    return (<Box className={classes.container}>
        <div className={classes.logo}>
            <img src={"/iceLogo.png"} className="h-8 mr-3" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                ICE
            </span>
        </div>

        <Typography variant="subtitle2" className={classes.signIn}>
            Sign in with an ICE Game Store account
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="email"
                defaultValue="" // Add a default value here
                render={({ field: { ref, ...rest } }) => (
                    <div>
                        <TextField {...rest}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            inputRef={ref}
                            classes={{ root: classes.textFieldRoot }}
                            fullWidth={true}
                            variant="outlined"
                            type="email"
                            label="Email"
                            id="email">
                        </TextField>
                    </div>
                )}
            /> 

            <Controller
                control={control}
                name="password"
                defaultValue="" // Add a default value here
                render={({ field: { ref, ...rest } }) => (
                    <TextField {...rest}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        inputRef={ref}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleVisibility}>
                                        {shouldShowPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }} type={shouldShowPassword ? "text" : "password"}
                        classes={{ root: classes.textFieldRoot }}
                        fullWidth={true} variant="outlined"
                        label="Password"
                        id="password">
                    </TextField>
                )}
            />

            <Box className={classes.resetPassword}>
                <Controller
                    control={control}
                    name="rememberMe"
                    defaultValue={false} 
                    render={({ field: { ref, ...rest } }) => (
                        <FormControlLabel {...rest}
                            inputRef={ref}
                            label="Remember me"
                            // classes={{ root: classes.checkboxRoot }}
                            control={<Checkbox />}
                        />
                    )}
                />
                <Link to="/forgot-password" className={classes.link}>
                    <Typography variant="body1">
                        Forget your password?
                    </Typography>
                </Link>
            </Box>

            <Box className={classes.buttonWrapper}>
                <Button fullWidth={true} variant="contained" className={classes.button} type="submit">
                    Login now
                </Button>
            </Box>

            <Box className={classes.signUpWrapper}>
                <Typography variant="body1">
                    Don't have an ICE account? &nbsp;
                </Typography>
                <Link to="/signup" className={classes.link}>
                    <Typography variant="body1">
                        Sign up
                    </Typography>
                </Link>
            </Box>
        </form>
    </Box>);
}

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        maxWidth: '450px',
        marginTop: '15px',
        marginBottom: '70px',
        marginLeft: '30%',
        //backgroundColor: '#202020',
        padding: '17px 60px',
        flexDirection: 'column'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
    },
    signIn: {
        color: 'black',
        textAlign: 'center',
        margin: '20px',
        width: '100%',
        textTransform: 'capitalize'
    },
    form: {
        maxwith: '380px',
        width: '100%',
        marginTop: '20px'
    },
    textFieldRoot: {
        height: '85px',
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
        }
    },
    resetPassword: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    checkboxRoot: {
        marginLeft: '-Spx',
        color: '#565252',
        '& .MuiCheckbox-root': {
            //color: 'rgba(255, 255, 255, 0.72)'
            color: '#565252'
        },
        '& .MuiFormControlLabel-root': {
            marginleft: 'Spx'
        }
    },
    link: {
        disply: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        color: '#565252',
        textDecoration: 'underline',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none'
        }
    },
    buttonWrapper: {
        width: '100%',
        maxWidth: '100%',
        marginTop: '30px'
    },
    button: {
        minHeight: '60px',
        color: '#565252',
        //backgroundColor: '#0074E4',
        backgroundColor: '#B5C2E3',
        '&:hover': {
            //backgroundColor: 'rgb(40, 138, 232)'
            backgroundColor: '#7E95CD',
        }
    },
    signUpWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px'
    }
})

export default LoginForm;


/* import React, { useState } from "react";
import { Checkbox, Button, Box, FormHelperText,  Container, FormControlLabel, IconButton, InputAdornment, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Joi from "@hapi/joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { TextField } from '@mui/material';


interface LoginFormProps {
    
}

interface LoginFormInput {
    email: string;
    password: string;
    rememberMe: boolean,
}

const validationSchema = Joi.object({
    email: Joi.string()
           .email({ tlds: { allow: false } })
           .required(), //must be a valid email address
    password: Joi.string()
           .min(8)
           .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
           .required().label("Password"),
    rememberMe: Joi.boolean().optional(),
});

const LoginForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isValid }} = useForm<LoginFormInput>({
        resolver: joiResolver(validationSchema)
    });

    const onSubmit: SubmitHandler<LoginFormInput> = data => {
        console.log(errors);
        console.log(data);
    }

    const [shouldShowPassword, setShouldShowPassword] = useState<boolean>(false);
    const classes = useStyles()

    const handleVisibility = () => {
        setShouldShowPassword(prevValue => !prevValue)
    }

    return (<Box className={classes.container}>
        <div className={classes.logo}>
            <img src={"/iceLogo.png"} className="h-8 mr-3" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                ICE
            </span>
        </div>

        <Typography variant="subtitle2" className={classes.signIn}>
            Sign in with an ICE Game Store account
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <TextField 
                classes={{ root: classes.textFieldRoot }}
                fullWidth={true}
                variant="outlined"
                label="Email"
                {...register("email")}
                type="email"
                id="email">
            </TextField>
            {errors.email && (
                <p> {errors.email?.message} </p>
            )} 


            <TextField
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleVisibility}>
                                {shouldShowPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    )
                }} type={shouldShowPassword ? "text" : "password"}
                classes={{ root: classes.textFieldRoot }}
                fullWidth={true} variant="outlined"
                label="Password"
                {...register("password")}
                id="password">
            </TextField>
            {errors.password && (
                <p> {errors.password.message} </p>
            )}
                

            <Box className={classes.resetPassword}>
                
                <FormControlLabel
                    label="Remember me"
                    classes={{ root: classes.checkboxRoot }}
                    control={<Checkbox />}
                />
             
                <Link to="/forgot-password" className={classes.link}>
                    <Typography variant="body1">
                        Forget your password?
                    </Typography>
                </Link>
            </Box>

            <Box className={classes.buttonWrapper}>
                <Button  fullWidth={true} variant="contained" className={classes.button} type="submit">
                    Login now
                </Button>
            </Box>

            <Box className={classes.signUpWrapper}>
                <Typography variant="body1">
                    Don't have an ICE account? &nbsp;
                </Typography>
                <Link to="/signup" className={classes.link}>
                    <Typography variant="body1">
                        Sign up
                    </Typography>
                </Link>
            </Box>
        </form>
    </Box>);
}

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        maxWidth: '450px',
        marginTop: '15px',
        marginBottom: '70px',
        marginLeft: '30%',
        //backgroundColor: '#202020',
        padding: '17px 60px',
        flexDirection: 'column'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
    },
    signIn: {
        color: 'black',
        textAlign: 'center',
        margin: '20px',
        width: '100%',
        textTransform: 'capitalize'
    },
    form: {
        maxwith: '380px',
        width: '100%',
        marginTop: '20px'
    },
    textFieldRoot: {
        height: '85px',
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
        }
    },
    resetPassword: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    checkboxRoot: {
        marginLeft: '-Spx',
        color: '#565252',
        '& .MuiCheckbox-root': {
            //color: 'rgba(255, 255, 255, 0.72)'
            color: '#565252'
        },
        '& .MuiFormControlLabel-root': {
            marginleft: 'Spx'
        }
    },
    link: {
        disply: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        color: '#565252',
        textDecoration: 'underline',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'none'
        }
    },
    buttonWrapper: {
        width: '100%',
        maxWidth: '100%',
        marginTop: '30px'
    },
    button: {
        minHeight: '60px',
        color: '#565252',
        //backgroundColor: '#0074E4',
        backgroundColor: '#B5C2E3',
        '&:hover': {
            //backgroundColor: 'rgb(40, 138, 232)'
            backgroundColor: '#7E95CD',
        }
    },
    signUpWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px'
    }
})

export default LoginForm; */
