import React, { useRef, useEffect, useState } from 'react';

const MyJotForm = () => {
  const iframeRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [downloadUrl, setDownloadUrl] = useState("")

  useEffect(() => {
    const handleIframeLoad = () => {
      setIframeLoaded(prev => prev + 1);
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);

      return () => {
        iframe.removeEventListener('load', handleIframeLoad);
      };
    }
  }, []);

  useEffect(() => {
    if (iframeLoaded === 2) {
      setIsModalOpen(true);
      function extractAnswers(data, keys) {
        const extractedValues = {};
    
        for (const key in data.answers) {
            const answerObj = data.answers[key];
    
            if (keys.includes(answerObj.name)) {
                let value;
    
                if (answerObj.name === 'gen_company_logo') {
                    value = answerObj.answer[0];
                } else if (
                    answerObj.name === 'gen_supplier_address' ||
                    answerObj.name === 'gen_supplier_contactphone' ||
                    answerObj.name === 'gen_supplier_name'
                ) {
                    value = answerObj.prettyFormat;
    
                    if (answerObj.name === 'gen_supplier_address') {
                        // Properly remove <br> tags
                        value = value.replace(/<br\s*\/?>/g, '');
                    }
                } else if (answerObj.name === 'gen_supplier_phone') {
                    value = answerObj.answer.full; // Extract the phone number correctly
                } else {
                    // Check if the answer is "Yes" or "No" and set the boolean value accordingly
                    if (answerObj.answer === "Yes") {
                        value = true;
                    } else if (answerObj.answer === "No") {
                        value = false;
                    } else {
                        value = answerObj.answer;
                    }
                }
    
                // Convert value to a string if it is not already, except for boolean values
                if (typeof value !== 'string' && typeof value !== 'boolean') {
                    value = JSON.stringify(value);
                }
    
                // Only add the key if it has a defined value
                if (value !== undefined && value !== 'undefined') {
                    extractedValues[answerObj.name] = value;
                }
            }
        }
    
        // Ensure all keys are included with either their value or default 'undefined'
        keys.forEach(key => {
            if (!(key in extractedValues)) {
                extractedValues[key] = 'undefined'; // Replace with a suitable default if needed
            }
        });
    
        // Convert to JSON string with double quotes
        return JSON.stringify(extractedValues, null, 2);
    }
    
      const keys = [
        "gen_company_name",
        "gen_company_logo",
        "gen_supplier_name",
        "gen_supplier_address",
        "gen_supplier_phone",
        "gen_supplier_contactperson",
        "gen_supplier_contactphone",
        "gen_supplier_contactemail",
        "supporthours",
        "pricing_basis",
        "pricing_peruser_1",
        "user_number",
        "pricing_perdevice_1",
        "device_number",
        "pricing_peruser_2",
        "user_monthlycharge",
        "pricing_perdevice_2",
        "device_monthlycharge",
        "pricing_fixedprice",
        "fixed_monthlyfee",
        "pricing_travelcharges",
        "pricing_traveldistance",
        "pricing_afterhours",
        "pricing_afterhours_rate",
        "pricing_afterhours_charge",
        "afterhours_additional_charge",
        "pricing_payment_terms",
        "pricing_priceincrease",
        "term_initial",
        "term_renewal",
        "renewal_term_duration",
        "term_autorenewal",
        "term_autorenewal_notice",
        "insurance",
        "insurance_types",
        "insurance_professionalindemnity",
        "insurance_publicliability",
        "liability_masterterms",
        "liability_limitation",
        "gen_businesshours",
        "gen_state",
        "managedservice_details_user",
        "managedservicedetails_servers",
        "managedservicedetails_network",
        "managedservice_thirdparty",
        "managedservice_thirdpartyCL"
      ]

      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch data from JotForm
          const jotformResponse = await fetch(`https://api.jotform.com/form/242281979236062/submissions?apiKey=09112de56b04f72a6b01037e5acda05c`);
          const jotformData = await jotformResponse.json();
          setResponse(jotformData.content);
          console.log(response, "response");
          console.log(jotformData.content[0], "content")
          // Post data to DocuGenerate
          const docuGenerateResponse = await fetch('https://api.docugenerate.com/v1/document', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': '77c792e891e0aa468b3d32342bf564cc'
            },
            body: JSON.stringify({
              "template_id": 'wGtPQ1pVuXgdDhDyzlWz',
              "data": extractAnswers(jotformData.content[0], keys)
            })
          });

          const docuGenerateData = await docuGenerateResponse.json();
          setDownloadUrl(docuGenerateData.document_uri);

        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false); // End loading
        }
      };

      fetchData();
    }
  }, [iframeLoaded]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.location.href = downloadUrl;
  };
  const jotUrl = "https://form.jotform.com/242281979236062";

  return (
    <div>
      {/* <h1>Kindly fill out this Form to generate the Agreement.</h1> */}
      <iframe
        ref={iframeRef}
        title="JotForm"
        src={jotUrl}
        width="100%"
        height="1000px"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      {isModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div>
                <p>Agreement(Document) generated successfully!</p>
                <button
                  onClick={handleCloseModal}
                  className="mt-8 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Download Agreement
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for the modal
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: "500px",
    height: "500px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
};

export default MyJotForm;
