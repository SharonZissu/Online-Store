import React from 'react';

import './DeliveryForm.css';

const DeliveryForm = ({ checkout, selectedDeliveryOption, handleOptionChange }) => {

    const delivery1 = 'Express delivery to the door: 10$';
    // const delivery2 = 'Express delivery to the door 10$';
    // const delivery3 = 'Express delivery to the door 10$';
    // const delivery4 = 'Express delivery to the door 10$';
    const delivery2 = 'Pick-up from a free service point: 0$';
    const delivery3 = 'Cash only delivery to courier: 15$';
    const delivery4 = 'Self-collection from the business: 0$';


    return (
        <div className={checkout ? 'checkout-delivery' : 'cart-delivery'}>
            <form action="" >
                <div>
                    <input type='checkbox' name='delivery' id="1" onChange={handleOptionChange} value={selectedDeliveryOption || ''} checked={(selectedDeliveryOption && selectedDeliveryOption === 1) ? 'checked' : false} />
                    <p><strong>{delivery1}</strong></p>
                </div><br />
                <div>
                    <input type='checkbox' name='delivery' id="2" onChange={handleOptionChange} value={selectedDeliveryOption || ''} checked={(selectedDeliveryOption && selectedDeliveryOption === 2) ? 'checked' : false} />
                    <p>{delivery2}</p>
                </div><br />
                <div>
                    <input type='checkbox' name='delivery' id="3" onChange={handleOptionChange} value={selectedDeliveryOption || ''} checked={(selectedDeliveryOption && selectedDeliveryOption === 3) ? 'checked' : false} />
                    <p>{delivery3}</p>
                </div><br />
                <div>
                    <input type='checkbox' name='delivery' id="4" onChange={handleOptionChange} value={selectedDeliveryOption || ''} checked={(selectedDeliveryOption && selectedDeliveryOption === 4) ? 'checked' : false} />
                    <p>{delivery4}</p>
                </div>
            </form>
        </div>);



}



export default DeliveryForm;