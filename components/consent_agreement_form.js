import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';
import { Button, CheckBox } from 'react-native-elements';

import { connect } from 'react-redux';
import { updateSession } from '../actions/session_actions';
import { saveScreenBlood } from '../actions/registration_actions';

import Colors from '../constants/Colors';
import States from '../actions/states';

class ConsentAgreementForm extends Component {

  state = {
    screeningBlood: null,
    errorMessage: '',
  }

  handleSubmit = () => {
    if ( this.state.screeningBlood == null ) {
      this.setState({errorMessage: "You must select whether or not you will allow collection of your baby's bloodspot."})
    } else {
      this.props.saveScreenBlood({screening_blood: this.state.screeningBlood})
      this.props.updateSession( {registration_state: States.REGISTERING_SIGNATURE} )
      //this.props.updateSession({registration_state: States.REGISTERING_USER })
    }
  }

  render() {

    return (

      <ScrollView contentContainerStyle={styles.scrollView} >

        <View style={styles.elevated}>
          
          <Text style={styles.title}>INFORMED CONSENT DOCUMENT</Text>

          <Text style={styles.header}>Project Title:</Text>
          <Text style={styles.text}>Assessment of Social Environment: A Pilot Study using Smart Phone Technology.</Text>

          <Text style={styles.header}>Principal Investigator:</Text>
          <Text style={styles.text}>Lane Strathearn MD PhD</Text>

          <Text style={styles.header}>Research Team Contacts:</Text>
          <Text style={styles.text}>Guifeng Xu MD (319 356 7044);
          Carol Mertens PhD (319 356 7044);
          Lane Strathearn MD PhD (319 356 7044)</Text>

          <Text style={styles.text}>This consent form describes the research study to help you decide if you want to participate.  This form provides important information about what you will be asked to do during the study, about the risks and benefits of the study, and about your rights as a research subject.</Text>
          <Text style={styles.text}>{'\u2022'} If you have any questions about or do not understand something in this form, you should ask the research team for more information.</Text>
          <Text style={styles.text}>{'\u2022'} You should discuss your participation with anyone you choose such as family or friends.</Text>
          <Text style={styles.text}>{'\u2022'} Do not agree to participate in this study unless the research team has answered your questions and you decide that you want to be part of this study.</Text>

          <Text style={styles.header}>WHAT IS THE PURPOSE OF THIS STUDY?</Text>
          <Text style={styles.text}>This is a research study.  We are inviting you to participate in this research study because you are either pregnant or the mother of a child under 2 years of age. In this study both you and your child will be considered research participants.</Text>
          <Text style={styles.text}>The purpose of this research study is test a new smart phone application called “BabySteps”, which is designed to help pregnant women and new mothers preserve the memories of their pregnancy and newborn’s experience, while also collecting information to help us to better understand risk factors for autism and other developmental disorders of early childhood.</Text>

          <Text style={styles.header}>HOW MANY PEOPLE WILL PARTICIPATE?</Text>
          <Text style={styles.text}>Approximately 80 mothers and their children will take part in this study conducted by investigators at the University of Iowa.</Text>

          <Text style={styles.header}>HOW LONG WILL I BE IN THIS STUDY?</Text>
          <Text style={styles.text}>If you agree to take part in this study, your involvement will last for up to three months, during which time you may be asked to answer simple questions about yourself, your pregnancy or your baby’s development; or to videotape yourself playing with your child. These tasks will appear on your cell phone several times per week. They can be completed at any convenient time for you and should take between 1 and 10 minutes of your time on each occasion.</Text>
        

          <Text style={styles.header}>WHAT WILL HAPPEN DURING THIS STUDY?</Text>
          <Text style={styles.text}>Before beginning any study procedures and/or signing the study consent, you will have participated in a phone or web-based screening interview to determine your eligibility to participate in the study.  If you were eligible, a link to download this smart phone app would have been sent to the email address you provided.</Text>
          <Text style={styles.text}>If you are still interested in this study after reading through the study description, you can press the “Agree” button as a form of consent, and then sign electronically.</Text>
          <Text style={styles.text}>During this study, you will be asked to answer some simple questions about your feelings during your pregnancy (if pregnant) or as a parent. You are free to skip any questions that you would prefer not to answer. These questions will include:</Text>
          <Text style={styles.text}>{'\u2022'} feelings that you are experiencing, such as stress or depression</Text>
          <Text style={styles.text}>{'\u2022'} thoughts about your pregnancy and motherhood</Text>
          <Text style={styles.text}>{'\u2022'} health issues or concerns</Text>
          <Text style={styles.text}>If your baby has already been born, you will be asked to videotape yourself with your baby, or take photos to capture special milestones like your baby’s first words or steps. These pictures and audio clips will only be used within our research studies, or with investigators with whom we collaborate. </Text>
          <Text style={styles.text}>In addition, you will receive screening tests for your baby’s language, motor, and cognitive development, as well as to screen for early signs of autism. If your child screens positive for a developmental concern, you will be referred for further assessment. Children who screen positive for autism may have a tele-health assessment or be referred to the Center for Disabilities and Development for additional testing by a developmental pediatrician. Support from the Regional Autism Assistance Program (RAP) will also be provided.</Text>
          <Text style={styles.text}>For mothers with children, we are asking your consent to access your baby’s newborn screening blood spots for genetic testing purposes (blood spots are obtained from all babies born in the State of Iowa). You are requested to give permission to use the blood spot in this research study.</Text>
          <Text style={styles.text}>Your sample, information, and/or data may be stripped of identifiers (such as name, date of birth, address, etc.) and placed in a central repository or other national repositories sponsored by the National Institutes of Health or other Federal agencies. Only qualified researchers who obtain proper permission may gain access to your sample and/or data for use in approved research studies. </Text>

          <Text style={styles.header}>Genetic Research</Text>
          <Text style={styles.text}>One purpose of this study is to look at genes (DNA) and how they affect health and disease. Genes are the instruction manual for the body. The genes you get from your parents influences what you look like and how your body behaves. They may also tell us more about a person’s risk for certain conditions such as autism.</Text>
          <Text style={styles.text}>You are being asked to give access to your baby’s newborn blood spot for genetic research. What we learn about your baby from this sample will not be put in your health record. Your test results will not be shared with you or your doctor. No one else (like a relative, boss, or insurance company) will be given your test results. </Text>
          <Text style={styles.text}>With your consent, the newborn blood spot may be obtained from Iowa Department of Public Health and analyzed at the University of Iowa. Results of a genetic test will not be provided to you or placed in the medical record.</Text>

          <Text style={styles.header}>Please initial below if you agree to the use of your baby’s newborn screening blood spots for genetic testing:</Text>
        
          <CheckBox
            title='Yes, I allow the investigators to access my baby’s newborn screening blood spots for genetic testing purpose.'
            textStyle={styles.checkboxText}
            checked={this.state.screeningBlood == true}
            containerStyle={!!this.state.errorMessage ? {backgroundColor: Colors.errorBackground} : {}}
            onPress={() => this.setState({screeningBlood: true, errorMessage: ''})}
           />

          <CheckBox
            title='No, I do not allow the investigators to access my baby’s newborn screening blood spots for genetic testing purpose. '
            textStyle={styles.checkboxText}
            checked={this.state.screeningBlood == false}
            containerStyle={!!this.state.errorMessage ? {backgroundColor: Colors.errorBackground} : {}}
            onPress={() => this.setState({screeningBlood: false, errorMessage: ''})}
           />
           <Text style={styles.header}>Genetic Information Nondiscrimination Act (GINA)</Text>
           <Text style={styles.text}>A new federal law called the Genetic Information Nondiscrimination Act (GINA) generally makes it illegal for health insurance companies, group health plans, and employers of 15 or more persons to discriminate against you based on your genetic information. Based on this new law, health insurance companies and group health plans are prohibited from requesting your genetic information that we get from this research. This means that they may not use your genetic information when making decisions regarding your eligibility for insurance coverage or the amount of your insurance premiums. Be aware that this new federal law will not protect you against genetic discrimination by companies that sell life insurance, disability insurance, or long-term care insurance.  The law also does not prohibit discrimination if you already have a manifest genetic disease or disorder.</Text>

          <Text style={styles.header}>Audio Recording/Video Recording/Photographs</Text>
          <Text style={styles.text}>One aspect of this study involves obtaining video recordings and photographs of you and your baby, collected on your smart phone.  In the longitudinal study, these will be used to observe changes in social behavior and development over the first two years of life. These videos will be stored in a secure location and only shared with those who are directly involved in the study, such as those who are doing the coding of the videos. These videos will be destroyed on study completion.</Text>
          <Text style={styles.text}>We will keep your name and contact information so that we can contact you in the future if we have additional research projects that you may qualify for. If this happens, we will provide you with a consent document and you will have the choice whether or not to participate in these additional studies.</Text>

          <Text style={styles.header}>WHAT ARE THE RISKS OF THIS STUDY?</Text>

          <Text style={styles.text}>You may experience one or more of the risks indicated below from being in this study. In addition to these, there may be other unknown risks, or risks that we did not anticipate, associated with being in this study. </Text>
          <Text style={styles.text}>There are also some personal questions on the questionnaires that you may be asked to complete that might make you feel uncomfortable. If you find these questions distressing, you may decline to answer them. </Text>
          <Text style={styles.textEmphasis}>There may be information uncovered during the course of this research study indicating physical or sexual abuse of a child under the age of 18.  The researcher conducting this study is required to follow the University of Iowa policy on Mandatory Reporting of Physical and Sexual Abuse of Children. We will be required to report this information to the authorities.</Text>
          <Text style={styles.text}>If any of this information changes, study staff will let you know with enough time for you to think about whether you still want to be in the study or if you would rather not participate.</Text>

          <Text style={styles.header}>Genetic Research</Text>
          <Text style={styles.text}>One risk of giving samples for this research may be the release of your name that could link your child to the stored samples and/or the results of the tests run on your samples. To prevent this, these samples will be given a code. Only the study staff will know the code. The name that belongs to the code will be kept in a locked file or in a computer with a password. Only the primary study investigators will have access to your name.</Text>

          <Text style={styles.header}>WHAT ARE THE BENEFITS OF THIS STUDY?</Text>
          <Text style={styles.text}>We don’t know if you will benefit from being in this study.</Text>
          <Text style={styles.text}>However, we hope that, in the future, other people might benefit from this study, by using the smart phone app to collect information about possible risk factors for autism and other developmental problems in early childhood.</Text>

          <Text style={styles.header}>WILL IT COST ME ANYTHING TO BE IN THIS STUDY?</Text>
          <Text style={styles.text}>You will not have any additional costs associated with being in this research study.  There will be no costs to you for the smart phone app, screening questionnaires, or genetic testing of your baby’s newborn screening blood spots.  Your and/or your health insurance company will be billed for any tests or procedures that are part of your child’s regular medical care, including the costs associated with any in-person diagnostic evaluations your child may be referred for during the course of the study.</Text>

          <Text style={styles.header}>WILL I BE PAID FOR PARTICIPATING?</Text>
          <Text style={styles.text}>You will be paid up to $40 in an Amazon e-gift card for participating in a one-on-one interview and/or completed app testing ($20 for interview + $20 for app testing). A link will be sent to your email address.</Text>

          <Text style={styles.header}>WHO IS FUNDING THIS STUDY?</Text>
          <Text style={styles.text}>The University and the research team are receiving no payments from other agencies, organizations or companies to conduct this research study.</Text>

          <Text style={styles.header}>WHAT ABOUT CONFIDENTIALITY?</Text>
          <Text style={styles.text}>We will keep your participation in this research study confidential to the extent permitted by law.  However, it is possible that other people such as those indicated below may become aware of your participation in this study and may inspect and copy records pertaining to this research.  Some of these records could contain information that personally identifies you.</Text>
          <Text style={styles.text}>{'\u2022'} federal government regulatory agencies,</Text>
          <Text style={styles.text}>{'\u2022'} The Food and Drug Administration</Text>
          <Text style={styles.text}>{'\u2022'} auditing departments of the University of Iowa, and</Text>
          <Text style={styles.text}>{'\u2022'} the University of Iowa Institutional Review Board (a committee that reviews and approves research studies)</Text>
          <Text style={styles.text}>To help protect your confidentiality, we will only ask you to provide information necessary to meet the aims of this study.  Any information collected by computer or smart phone will be transmitted in a secure and confidential manner. A confidential number will be assigned to the information you provide, so that confidential information cannot be linked to you personally.  If we write a report or article about this study or share the study data set with others, we will do so in such a way that you cannot be directly identified.</Text>

          <Text style={styles.header}>WILL MY HEALTH INFORMATION BE USED DURING THIS STUDY?</Text>
          <Text style={styles.text}>The Federal Health Insurance Portability and Accountability Act (HIPAA) requires your healthcare provider to obtain your permission for the research team to access or create “protected health information” about you for purposes of this research study.  Protected health information is information that personally identifies you and relates to your past, present, or future physical or mental health condition or care.  We will access or create health information about you, as described in this document, for purposes of this research study. Once your healthcare provider has disclosed your protected health information to us, it may no longer be protected by the Federal HIPAA privacy regulations, but we will continue to protect your confidentiality as described under “Confidentiality.”</Text>
          <Text style={styles.text}>We may share your health information related to this study with other parties including federal government regulatory agencies, the University of Iowa Institutional Review Boards and support staff, and research collaborators.</Text>
          <Text style={styles.text}>You cannot participate in this study unless you permit us to use your protected health information.  If you choose not to allow us to use your protected health information, we will discuss any non-research alternatives available to you.  Your decision will not affect your right to medical care that is not research-related.  Your signature on this Consent Document authorizes your healthcare provider to give us permission to use or create health information about you.</Text>
          <Text style={styles.text}>Although you may not be allowed to see study information until after this study is over, you may be given access to your health care records by contacting your health care provider. Your permission for us to access or create protected health information about you for purposes of this study has no expiration date. You may withdraw your permission for us to use your health information for this research study by sending a written notice to Dr. Lane Strathearn, 100 Hawkins Dr, CDD, Iowa City IA.  However, we may still use your health information that was collected before withdrawing your permission.  Also, if we have sent your health information to a third party, such as the study sponsor, or we have removed your identifying information, it may not be possible to prevent its future use.  You will receive a copy of this signed document.</Text>

          <Text style={styles.header}>IS BEING IN THIS STUDY VOLUNTARY?</Text>
          <Text style={styles.text}>Taking part in this research study is completely voluntary.  You may choose not to take part at all.  If you decide to be in this study, you may stop participating at any time.  If you decide not to be in this study, or if you stop participating at any time, you won’t be penalized or lose any benefits for which you otherwise qualify.</Text>

          <Text style={styles.header}>WHAT IF I HAVE QUESTIONS?</Text>

          <Text style={styles.text}>We encourage you to ask questions.  If you have any questions about the research study itself, please contact: Lane Strathearn (319 356 7044).</Text>
          <Text style={styles.text}>If you have questions, concerns, or complaints about your rights as a research subject or about research related injury, please contact the Human Subjects Office, 105 Hardin Library for the Health Sciences, 600 Newton Rd, The University of Iowa, Iowa City, IA  52242-1098, (319) 335-6564, or e-mail irb@uiowa.edu.  General information about being a research subject can be found by clicking “Info for Public” on the Human Subjects Office web site, http://hso.research.uiowa.edu/. To offer input about your experiences as a research subject or to speak to someone other than the research staff, call the Human Subjects Office at the number above.</Text>
          <Text style={styles.text}>This Informed Consent Document is not a contract. It is a written explanation of what will happen during the study if you decide to participate. You are not waiving any legal rights by signing this Informed Consent Document. Your signature indicates that this research study has been explained to you, that your questions have been answered, and that you agree to take part in this study.  You will receive a copy of this form.</Text>

        </View>

        <Text style={styles.textError}>{this.state.errorMessage}</Text>

        <View style={styles.buttonContainer}>
          <Button
            color={Colors.grey}
            buttonStyle={styles.buttonOneStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={ () => { 
              this.props.updateSession( {registration_state: States.REGISTERING_AS_NO_STUDY} )
            }}
            title='Disagree' />
          <Button
            color={Colors.pink}
            buttonStyle={styles.buttonTwoStyle}
            titleStyle={styles.buttonTitleStyle}
            onPress={ ()=>this.handleSubmit() }
            title='Agree' />
        </View>

        

      </ScrollView>
    )
  }
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 5,
  },
  header: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'left',
  },
  text: {
    textAlign: 'left',
    fontSize: 11,
    padding: 5,
  },
  textEmphasis: {
    textAlign: 'left',
    textDecorationLine: 'underline',
    fontSize: 11,
    padding: 5,
  },
  textError: {
    textAlign: 'center',
    color: Colors.errorColor,
    fontSize: 11,
    padding: 5,
  },
  elevated: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 3,
    elevation: 2,
  },
  checkboxText: {
    fontSize: 11,
  },
  buttonContainer: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  buttonOneStyle: {
    width: 150,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonTwoStyle: {
    width: 150,
    backgroundColor: Colors.lightPink,
    borderColor: Colors.pink,
    borderWidth: 2,
    borderRadius: 5,
  },
});

const mapStateToProps = ({ session }) => ({ session });
const mapDispatchToProps = { updateSession, saveScreenBlood };

export default connect( mapStateToProps, mapDispatchToProps )(ConsentAgreementForm);