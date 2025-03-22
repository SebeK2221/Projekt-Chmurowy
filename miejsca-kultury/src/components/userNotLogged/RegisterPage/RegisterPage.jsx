import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const isValidate = () => {
        let isProceed = true;
        let errorMessage = 'Proszę uzupełnić brakujące dane: ';
        
        if (!name) {
            isProceed = false;
            errorMessage += ' Imię';
        }
        if (!surname) {
            isProceed = false;
            errorMessage += ' Nazwisko';
        }
        if (!email) {
            isProceed = false;
            errorMessage += ' Email';
        }
        if (!password) {
            isProceed = false;
            errorMessage += ' Hasło';
        }
        if (!repeatPassword) {
            isProceed = false;
            errorMessage += ' Powtórz hasło';
        }

        if (!isProceed) {
            toast.warning(errorMessage);
        } else {
            const emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!emailPattern.test(email)) {
                isProceed = false;
                toast.warning('Proszę wpisać poprawny email');
            }
        }

        if (repeatPassword !== password) {
            isProceed = false;
            toast.warning('Hasła nie są podobne');
        }

        return isProceed;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        let regObj = { name, surname, email, password, repeatPassword };
        console.log(regObj);
        if (isValidate()) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(regObj)
                });

                const data = await response.json();
                const message = JSON.stringify(data)
                const messageToDisplay = JSON.parse(message)
                if (response.ok) {
                    toast.success(`${messageToDisplay.message}`);
                } else {
                    toast.error(`${messageToDisplay.title}`)
                    Object.entries(data.errors).forEach(([key, value]) => {
                            toast.error(value.join(', '));
                    });
                }
            } catch (error) {
                console.error("Błąd:",error.message)
            }
        }
    }
    return (
        <div className="row">
            <div className="offset-lg-3 col-lg-6">
                <form className="container" onSubmit={handleSubmit} style={{ marginTop: '50px' }}>
                    <div className="card">
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'center' }}>
                            <h2>Rejestracja</h2>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Imię</label>
                                        <input value={name} onChange={e => setName(e.target.value)} className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Nazwisko</label>
                                        <input value={surname} onChange={e => setSurname(e.target.value)} className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Hasło</label>
                                        <input type='password' value={password} onChange={e => setPassword(e.target.value)} className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <label>Powtórz hasło</label>
                                        <input type='password' value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer" style={{ display: 'flex', justifyContent: 'center' }}>
                            <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>Zarejestruj się</button>
                            <Link className="btn btn-success" to={'/login'}>Zaloguj się</Link>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default RegisterPage;