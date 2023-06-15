import React, { useState } from "react";
import { Checkbox, Button, Box, FormControlLabel, FormHelperText, IconButton, InputAdornment, TextField, Typography, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Link } from 'react-router-dom';
import countries, {Country} from '../../Ressources/countryList';
//import Autocomplete from '@mui/lab/Autocomplete';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { InfoOutlined } from "@material-ui/icons";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Joi from '@hapi/joi';
import { joiResolver } from "@hookform/resolvers/joi";


interface SignupFormInput {
    country: Country | null;
    name: string;
    surname: string;
    displayName: string;
    email: string
    password: string;
    termsAccepted: boolean;
}

const validationSchema= Joi.object({
    country: Joi.string().allow(...countries.map((country) => country.code)).label("Country"),
    name: Joi.string().required().label("Name"),
    surname: Joi.string().required().label("Surname"),
    displayName: Joi.string()
                .min(5).max(16)
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .required().label("Display Name"), //must contain only letters and numbers, between 5 and 16 characters
    email: Joi.string()
           .email({ tlds: { allow: false } })
           .required().label("Email"), //must be a valid email address
    password: Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
            .required().label("Password"), //at least one uppercase letter, one lowercase letter, one digit, and one special character
    termsAccepted: Joi.boolean().invalid(false).messages({
        "any.invalid": "Please accept our terms",
    }),
});

/* interface SignupFormProps {
    
} */

const SignupForm: React.FC = () => {
    const { control, handleSubmit, formState: { errors }, } = useForm<SignupFormInput>({
        resolver: joiResolver(validationSchema),
      });

    const onSubmit: SubmitHandler<SignupFormInput> = data => {
        console.log(data);
        console.log(errors);
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

        <Typography variant="subtitle2" className={classes.signUp}>
            Sign up to ICE Game Store
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            
            <Controller
                control={control}
                name="country"
                defaultValue={null}
                render={({ field: { ref, ...rest } }) => (
                    <div>
                        <InputLabel htmlFor="country">Country</InputLabel>
                        <Autocomplete<Country | null>
                            {...rest}
                            defaultValue={null}
                            value={countries.find((country) => rest.value == null && rest.value === country.code)}
                            onChange={(_, chosenCountry) => rest.onChange(chosenCountry?.code)}
                            fullWidth={true}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="country" // Add the id here
                                    className={classes.textFieldRoot}
                                    variant="outlined"
                                    required={true}
                                    error={!!errors.country}
                                    helperText={errors.country?.message}
                                />
                            )}
                            options={countries}
                            getOptionLabel={(option) => option?.name ?? ""}
                        />
                    </div>
                )}
            /> 
               
            <Box className={classes.nameBox}>
                <Controller
                    control={control}
                    name="name"
                    defaultValue="" 
                    render={({field: { ref, ...rest }}) => (
                        <div>
                            <InputLabel htmlFor="name">Name</InputLabel>
                            <TextField {...rest} 
                            inputRef={ref}
                            className={classes.textFieldRoot} 
                            required={true} 
                            variant="outlined" 
                            id="name"
                            error={!!errors.name}
                            helperText={errors.name?.message}/>
                        </div>
                    )}
                />
                <Controller
                    control={control}
                    name="surname"
                    defaultValue="" 
                    render={({field: { ref, ...rest }}) => (
                        <div>
                            <InputLabel htmlFor="surname">Surname</InputLabel>
                            <TextField {...rest} 
                            inputRef={ref}
                            className={classes.textFieldRoot} 
                            required={true} 
                            variant="outlined" 
                            id="surname" 
                            error={!!errors.surname}
                            helperText={errors.surname?.message}/>
                        </div>
                    )}
                />
            </Box>

            <Controller
                control={control}
                name="displayName"
                defaultValue="" 
                render={({ field: { ref, ...rest } }) => (
                    <div>
                        <InputLabel htmlFor="displayName">Display Name</InputLabel>
                        <TextField {...rest}
                            inputRef={ref}
                            className={classes.textFieldRoot}
                            required={true} variant="outlined"
                            id="displayName"
                            fullWidth={true}
                            error={!!errors.displayName}
                            helperText={errors.displayName?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip classes={{ tooltip: classes.tooltip }} title="The display name must be between 5 and 16 characters long & must contain only letters and numbers">
                                            <IconButton>
                                                <InfoOutlined></InfoOutlined>
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                )}
            />

            <Controller
                control={control}
                name="email"
                defaultValue="" 
                render={({field: { ref, ...rest }}) => (
                    <div>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <TextField {...rest}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            inputRef={ref}
                            classes={{ root: classes.textFieldRoot }}
                            fullWidth={true}
                            required={true}
                            variant="outlined"
                            type="email"
                            id="email">
                        </TextField>
                    </div>
                )}
            />

            <Controller
                control={control}
                name="password"
                defaultValue="" 
                render={({field: { ref, ...rest }}) => (
                    <div>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <TextField {...rest}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            inputRef={ref}
                            InputProps={{
                                endAdornment: (
                                    <>
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleVisibility}>
                                                {shouldShowPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                        <InputAdornment key="tooltip" position="end">
                                            <Tooltip classes={{ tooltip: classes.tooltip }} title="The password must contain min 8 characters long -> at least one uppercase letter, one lowercase letter, one digit, and one special character">
                                                <IconButton>
                                                    <InfoOutlined></InfoOutlined>
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    </>
                                )
                            }}
                            type={shouldShowPassword ? "text" : "password"}
                            classes={{ root: classes.textFieldRoot }}
                            fullWidth={true}
                            variant="outlined"
                            id="password"
                            required={true}>
                        </TextField>
                    </div>
                )}
            />

            <Controller
                control={control}
                defaultValue={false}
                name="termsAccepted"
                render={({ field: { ref, ...rest } }) => (
                    <FormControlLabel {...rest}
                        /* error={!!errors.termsAccepted}
                        helperText={errors.termsAccepted?.message} */
                        inputRef={ref}
                        control={<Checkbox />}
                        label={
                            <div>
                                <Typography variant="body1">
                                    I understand and accept &nbsp;
                                    <Link to="/privacy" className={classes.link}>
                                        the terms of Service
                                    </Link>
                                </Typography>
                                <FormHelperText error={!!errors.termsAccepted}>
                                    {errors.termsAccepted?.message}
                                </FormHelperText>
                            </div>
                        }
                    />
                )}
            />

            <Box className={classes.buttonWrapper}>
                <Button fullWidth={true} variant="contained" className={classes.button} type="submit">
                    Sign up now
                </Button>
            </Box>

            <Box className={classes.logInWrapper}>
                <Typography variant="body1">
                    Already have an ICE account? &nbsp;
                </Typography>
                <Link to="/login" className={classes.link}>
                    <Typography variant="body1">
                        Login
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
        marginTop: '0px',
        marginBottom: '0px',
        marginLeft: '30%',
        //backgroundColor: '#202020',
        padding: '10px 40px',
        flexDirection: 'column' 
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'black',
    },
    signUp: {
        color: 'black',
        textAlign: 'center',
        margin: '10px',
        width: '100%',
        textTransform: 'capitalize'
    },
    form: {
        //flexGrow: 1,
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
    nameBox: {
        display: "flex",
        '& > :not(:first-child)': {
            marginLeft: '7.5px'
        },
        '& > :not(:last-child)': {
            marginRight: '7.5px'
        },
    },
    tooltip: {
        fontSize: '0.875rem',
        padding: '10px 20px',
        borderRadius: '4px'

    },
    checkboxRoot: {
        marginLeft: '-Spx',
        marginTop: '10px',
        color: 'black',
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
    logInWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px'
    }
})

export default SignupForm;
