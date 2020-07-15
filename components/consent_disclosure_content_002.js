import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { connect } from 'react-redux';

import ConsentDisclosureScreeningBlood from './consent_disclosure_screening_blood';

import Colors from '../constants/Colors';

class ConsentDisclosureContent002 extends Component {
  state = {
    showItem: '',
  };

  setShowItem = item => {
    if (this.state.showItem === item) {
      this.setState({ showItem: null });
    } else {
      this.setState({ showItem: item });
    }
  };

  render() {
    const showItem = this.state.showItem;
    const { screeningBlood, errorMessage, formState } = this.props;
    return (
      <View>
        <View style={styles.elevated}>
          <Ionicons
            name="md-phone-portrait"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>
            Epigenetics and the Social Environment in Autism: A Cross-Sectional Study
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Principal Investigator:</Text>{'\n'}
            <Text style={styles.bullet}>{'\u2022'} </Text>
            <Text style={styles.listText}>Lane Strathearn MD PhD</Text>
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Research Team Contacts:</Text>
            {'\n'}
            <Text style={styles.bullet}>{'\u2022'} </Text>
            <Text style={styles.listText}>Emese Chmielewski BA (216 338 1370)</Text>
            {'\n'}
            <Text style={styles.bullet}>{'\u2022'} </Text>
            <Text style={styles.listText}>
              Tessa Meisner BAN RN (319 594 6639)
            </Text>
            {'\n'}
            <Text style={styles.bullet}>{'\u2022'} </Text>
            <Text style={styles.listText}>
              Lane Strathearn MD PhD (319 356 7044)
            </Text>
          </Text>
          <Text style={styles.text}>
            This consent form describes the research study to help you decide if
            you want to participate. This form provides important information
            about what you will be asked to do during the study, about the risks
            and benefits of the study, and about yours and your child's rights as research
            subjects.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bullet}>{'\u2022'} </Text>
            <Text style={styles.listText}>
              If you have any questions about or do not understand something in
              this form, you should ask the research team for more information.
            </Text>{'\n'}
            <Text style={styles.bullet}>{'\u2022'} </Text>
            <Text style={styles.listText}>
              You should discuss your participation with anyone you choose such
              as family or friends.
            </Text>{'\n'}
            <Text style={styles.bullet}>{'\u2022'} </Text>
            <Text style={styles.listText}>
              Do not agree to participate in this study unless the research team
              has answered your questions and you decide that you want you and your child to be
              part of this study.
            </Text>
          </Text>
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name="md-construct"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>What is the Purpose of this Study?</Text>
          <Text style={styles.text}>
            This is a research study. We are inviting you and your child to participate in this
            research study because your child, who may or may not have behavioral or developmental challenges, is 2 to 3 years old. In this study, both you and your child
            will be considered research participants.
          </Text>
          <Text style={styles.text}>
            The purpose of this research study is to better understand
            how genetics and the social environment influence the way children develop.
            Specifically, this study will use a smartphone application and blood samples 
            to study potential risk factors for Autism Spectrum Disorder or other developmental disorders.
          </Text>
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name="md-people"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>How Many People Will Participate?</Text>
          <Text style={styles.text}>
            Approximately 300 mothers and their children will take part in this
            study conducted by investigators at the University of Iowa.
          </Text>
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name="md-clock"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>How Long Will I Be in this Study?</Text>
          <Text style={styles.text}>
            If you agree to take part in this study, you/your child's involvement will last
            for about 10 months. This may include one or two 15-minute in-person visit(s) 
            to the Center for Disabilities and Development (CDD), and your continued use of the
            smartphone app, 'BabySteps' from your home. Completing a prompt or task from the app
            should only take a few minutes of your time on each occasion. 
          </Text>
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name="md-clipboard"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>What Will Happen During this Study?</Text>
          <Text style={styles.text}>
            Once your eligibility is discussed, we will e-mail a link to access the BabySteps smartphone
            application. After you have reviewed the BabySteps app, you can press the "Agree" button on the 
            application to formally consent to the study, and can sign electronically. You and your child cannot
            participate in this study without giving signed permission. Once the consent form is properly completed,
            you/your child may complete other app-based tasks and in-person procedures.
          </Text>
          <Text style={styles.text}>
            During this study, each mother-child pair may meet with researchers once or twice. 
            If your child has an appointment scheduled at the CDD or another University of Iowa clinic,
            study researchers may meet with you shortly before this appointment. A blood draw may be part of 
            the standard care for these appointments, and researchers may request access to a small amount
            of the blood that is drawn at that time. If your child is not scheduled for a clinical evaluation, or was 
            scheduled for evaluation but did not have blood drawn at that time, researchers will contact
            you to explain the procedures for a blood sample collection for your child. This sample can be collected
            at the CDD by healthcare staff or by you in your home. These blood samples will be compared to a sample
            of blood that was taken when your child was born (those samples are obtained from all babies born in the 
            State of Iowa). Analyzing the two samples will reveal whether chemical ("epigenetic") changes occurred over time. 
          </Text>
          <Text style={styles.text}>
            Researchers will also orient your to the smartphone application, BabySteps, that you will be asked to use 
            for about 10 months. Within the app, you will be able to take photos and record special milestones.
            Occasionally, you will be asked to videotape yourself playing with your child. You will also complete 
            screening tests or questions designed to assess your child's language, motor, and cognitive development.
            Some of these screening tests will assess for early signs of autism. Certain results may indicate your child
            is not eligible to continue in this study. If this occurs, you will be notified. You are fee to continue 
            use of the app, if you so choose. 
          </Text>
          <Text style={styles.text}>
            We may ask other questions about your mood, your feelings, day-to-day life, or your history.
            You are free to skip any questions that your would prefer not to answer. Prompts will appear
            on your cell phone several times per week and will usually only require a single button press. 
            You should try to answer these as soon as you see them. Other prompts should take between 1 and 10 
            minutes to complete on occasion. If any of the information gathered through the app, such as information
            about your well-being or your child's development, indicates a need for intervention, you may be 
            referred to appropriate providers. 
          </Text>
          <Text style={styles.text}>
            You are free to share content stored in the app to your social media accounts. 
            Study researchers and collaborators will only use your data and content for the 
            purposes of this study unless you give consent for it to be shared 
            with other researchers. If your child was assessed in the CDD, we will 
            also obtain information from your child's medical record about the results 
            of the evaluation by the doctor, psychologist, and/or speech therapist. 
          </Text>
          <Text style={styles.text}>
            As part of this study, we are obtaining blood samples from your child.
            We and other researchers may wish to study your child's blood samples 
            in the future, after this study witout further consent. These samples,
            information, and/or data may be placed in a central repository or other 
            national repositories sponsored by the National Institutes of Health or 
            other Federal agensies. If this happnes, it may be stripped of identities 
            (such as name, date of birth, address, etc.). Other qualified researchers
            who obtain proper permission may gain access to your sample and/or data 
            for use in approved research studies that may or may not be related to the 
            purpose of this study.
          </Text>
          <Text style={styles.text}>
            Blood cells removed from the blood samples may be used to make a cell line 
            and DNA or conduct whole genome sequencing. Cell lines are produced by growing
            blood cells in a laboratory and allow us to have a source of the DNA without 
            having to redraw your blood. These blood cells can be stored for decades or
            more. The DNA and data might be available to researchers trying to learn more 
            about the cause of diseases. 
          </Text>
          <Text style={styles.text}>
            Each of the cells in your body contains DNA. DNA is the isntruction manual
            that determines your appearance in things like eye color or how tall you
            can be. Your DNA may also lead to higher or lower risk of certain diseases.
            Your environment will also determine some of your disease risk.
          </Text>
          <Text style={styles.text}>
            Your DNA is a string of four building blocks, called "bases." These bases
            are represented by the letters arranged in packages like words. Each of these 
            "words" have specific jobs in the body. Most of the time, the letters are the 
            same in everyone. But about 1% of the population might have an "A" where 
            someone else has a "G." This difference can explain why some people have blue
            eyes and others brown eyes, or why some have a high risk for a certain cancer
            and others a low risk. All these letters come together to create your 
            "genome sequence," a kind of book of your genetics. It is now possible to 
            read off each of these letters and read your complete genome sequence. 
            Your DNA sequence is unique to you. You inherit your DNA in almost equal parts
            from each of your parents. In very rare cases, your genome can also change 
            through "mutations." A mutation is like if you tried to copy a page from a 
            book, but misspelled some words. Mutations usually result from copying errors 
            in certain letters when being passed from parent to child.            
          </Text>
          <Text style={styles.text}>
            When we take a sample of your child's blood for this study, it might go
            to a lab to read off those letters and give us a report on your child's
            genome. This information will then be compared with other genomes to see
            how they may be the same or different. It is our hope that this will help
            us to better understand how the human body works and/or what causes it 
            to not work well, as when someone has a disease. 
          </Text>          
          <Text style={styles.text}>
            The tests we might want to use to study your child's blood samples may
            not even exist at this time. Therefore, we are asking for your permisison
            to store your child's blood samples so that we can study them in the 
            future. These future studies may provide additional information that will 
            be helpful in understanding Autism Spectrum Disorder, but it is unlikely
            that what we learn from these studies will have a direct benefit to you
            or your child. It is possible that your child's blood samples might be 
            used to develop products, tests, or discoveries that could be patented
            and licensed. In some instances, these may have potential commercial
            value and may be developed by the Investigators, University of Iowa,
            commercial companies, funding organization, or others that may not be 
            working directly with this research team. However, donors of blood
            samples do not retain any property rights to the materials. Therefore, 
            there are no plans to provide financial compensation to you should
            this occur. 
          </Text>
          <Text style={styles.text}>
            Your child's blood samples will be stored with a code which may be 
            linked to your/your child's identifying information, such as name
            or date of birth. If you agree now to future use of your child's 
            blood sample but decide in the future that you would like to have 
            it removed from future research, you should contact Lane Strathearn,
            MD PhD (319-356-7044). However, if some researach with your child's
            blood sample has already been completed, the information from that 
            resarch may still be used.                 
          </Text>
          <Text style={styles.subTitle}>Genetic Research</Text>
          <Text style={styles.text}>
            One purpose of this study is to look at genes (DNA) and how they
            affect health and disease. Genes are the instruction manual for the
            body. The genes you get from your parents influences what you look
            like and how your body behaves. They may also tell us more about a
            person’s risk for certain conditions such as autism.
          </Text>
          <Text style={styles.text}>
            You are being asked to give access to your baby’s newborn blood spot
            for genetic research. What we learn about your baby from this sample
            will not be put in your health record. Your test results will not be
            shared with you or your doctor. No one else (like a relative, boss,
            or insurance company) will be given your test results.
          </Text>
          <Text style={styles.text}>
            With your consent, the newborn blood spot may be obtained from Iowa
            Department of Public Health and analyzed at the University of Iowa.
            Results of a genetic test will not be provided to you or placed in
            the medical record.
          </Text>

          <View
            onLayout={(event) => {
              const {x, y, width, height} = event.nativeEvent.layout;
              this.props.setErrorMessageLocation(y);
            }}
          />

          <ConsentDisclosureScreeningBlood
            screeningBlood={screeningBlood}
            errorMessage={errorMessage}
            formState={formState}
            handleScreeningBlood={(screeningBlood, errorMessage) =>
              this.props.handleScreeningBlood(screeningBlood, errorMessage)
            }
          />

          <Text
            ref={ref => (this._checkboxError = ref)}
            style={styles.textError}
          >
            {this.props.errorMessage}
          </Text>

          <TouchableOpacity onPress={() => this.setShowItem('item_01')}>
            <View style={styles.toggleContainer}>
              <Ionicons
                name={"md-arrow-" + (showItem === 'item_01' ? "dropdown" : "dropright")}
                size={32}
                style={styles.iconToggle}
                color={Colors.iconDefault}
              />
              <Text style={styles.subTitle}>
                Genetic Information Nondiscrimination Act (GINA)
              </Text>
            </View>
          </TouchableOpacity>

          {showItem === 'item_01' && (
            <Text style={styles.text}>
              A new federal law called the Genetic Information Nondiscrimination
              Act (GINA) generally makes it illegal for health insurance
              companies, group health plans, and employers of 15 or more persons
              to discriminate against you based on your genetic information.
              Based on this new law, health insurance companies and group health
              plans are prohibited from requesting your genetic information that
              we get from this research. This means that they may not use your
              genetic information when making decisions regarding your
              eligibility for insurance coverage or the amount of your insurance
              premiums. Be aware that this new federal law will not protect you
              against genetic discrimination by companies that sell life
              insurance, disability insurance, or long-term care insurance. The
              law also does not prohibit discrimination if you already have a
              manifest genetic disease or disorder.
            </Text>
          )}

          <TouchableOpacity onPress={() => this.setShowItem('item_02')}>
            <View style={styles.toggleContainer}>
              <Ionicons
                name={"md-arrow-" + (showItem === 'item_02' ? "dropdown" : "dropright")}
                size={32}
                style={styles.iconToggle}
                color={Colors.iconDefault}
              />
              <Text style={styles.subTitle}>
                Audio Recording/Video Recording/Photographs
              </Text>
            </View>
          </TouchableOpacity>

          {showItem === 'item_02' && (
            <View>
              <Text style={styles.text}>
                One aspect of this study involves obtaining video recordings and
                photographs of you and your baby, collected on your smart phone.
                In the longitudinal study, these will be used to observe changes
                in social behavior and development over the first two years of
                life. These videos will be stored in a secure location and only
                shared with those who are directly involved in the study, such
                as those who are doing the coding of the videos. These videos
                will be destroyed on study completion.
              </Text>
              <Text style={styles.text}>
                We will keep your name and contact information so that we can
                contact you in the future if we have additional research
                projects that you may qualify for. If this happens, we will
                provide you with a consent document and you will have the choice
                whether or not to participate in these additional studies.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name="md-cog"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>What are the Risks of This Study?</Text>
          <Text style={styles.text}>
            You may experience one or more of the risks indicated below from
            being in this study. In addition to these, there may be other
            unknown risks, or risks that we did not anticipate, associated with
            being in this study.
          </Text>
          <Text style={styles.text}>
            There are also some personal questions on the questionnaires that
            you may be asked to complete that might make you feel uncomfortable.
            If you find these questions distressing, you may decline to answer
            them.
          </Text>
          <Text style={[styles.text, styles.underline]}>
            There may be information uncovered during the course of this
            research study indicating physical or sexual abuse of a child under
            the age of 18. The researcher conducting this study is required to
            follow the University of Iowa policy on Mandatory Reporting of
            Physical and Sexual Abuse of Children. We will be required to report
            this information to the authorities.
          </Text>
          <Text style={styles.text}>
            If any of this information changes, study staff will let you know
            with enough time for you to think about whether you still want to be
            in the study or if you would rather not participate.
          </Text>
          <TouchableOpacity onPress={() => this.setShowItem('item_03')}>
            <View style={styles.toggleContainer}>
              <Ionicons
                name={"md-arrow-" + (showItem === 'item_03' ? "dropdown" : "dropright")}
                size={32}
                style={styles.iconToggle}
                color={Colors.iconDefault}
              />
              <Text style={styles.subTitle}>Genetic Research</Text>
            </View>
          </TouchableOpacity>

          {showItem === 'item_03' && (
            <Text style={styles.text}>
              One risk of giving samples for this research may be the release of
              your name that could link your child to the stored samples and/or
              the results of the tests run on your samples. To prevent this,
              these samples will be given a code. Only the study staff will know
              the code. The name that belongs to the code will be kept in a
              locked file or in a computer with a password. Only the primary
              study investigators will have access to your name.
            </Text>
          )}
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name="md-beaker"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>
            What are the Benefits of this Study?
          </Text>
          <Text style={styles.text}>
            We don’t know if you will benefit from being in this study.
          </Text>
          <Text style={styles.text}>
            However, we hope that, in the future, other people might benefit
            from this study, by using the smart phone app to collect information
            about possible risk factors for autism and other developmental
            problems in early childhood.
          </Text>
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name="md-cash"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>
            Will it Cost Me Anything or Will I be Paid to be in this Study?
          </Text>
          <Text style={styles.text}>
            You will not have any additional costs associated with being in this
            research study. There will be no costs to you for the smart phone
            app, screening questionnaires, or genetic testing of your baby’s
            newborn screening blood spots. Your and/or your health insurance
            company will be billed for any tests or procedures that are part of
            your child’s regular medical care, including the costs associated
            with any in-person diagnostic evaluations your child may be referred
            for during the course of the study.
          </Text>
          <Text style={styles.text}>
            You will be paid up to $40 in an Amazon e-gift card for
            participating in a one-on-one interview and/or completed app testing
            ($20 for interview + $20 for app testing). A link will be sent to
            your email address.
          </Text>

          <TouchableOpacity onPress={() => this.setShowItem('item_06')}>
            <View style={styles.toggleContainer}>
              <Ionicons
                name={"md-arrow-" + (showItem === 'item_06' ? "dropdown" : "dropright")}
                size={32}
                style={styles.iconToggle}
                color={Colors.iconDefault}
              />
              <Text style={styles.subTitle}>Who is funding this study?</Text>
            </View>
          </TouchableOpacity>

          {showItem === 'item_06' && (
            <Text style={styles.text}>
              The University and the research team are receiving no payments
              from other agencies, organizations or companies to conduct this
              research study.
            </Text>
          )}
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name="md-lock"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>What About Confidentiality?</Text>
          <Text style={styles.text}>
            We will keep your participation in this research study confidential
            to the extent permitted by law. However, it is possible that other
            people such as those indicated below may become aware of your
            participation in this study and may inspect and copy records
            pertaining to this research. Some of these records could contain
            information that personally identifies you.
          </Text>
          <View style={styles.list}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.listText}>
              federal government regulatory agencies,
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.listText}>
              The Food and Drug Administration
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.listText}>
              auditing departments of the University of Iowa, and
            </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.listText}>
              the University of Iowa Institutional Review Board (a committee
              that reviews and approves research studies)
            </Text>
          </View>
          <TouchableOpacity onPress={() => this.setShowItem('item_04')}>
            <View style={styles.toggleContainer}>
              <Ionicons
                name={"md-arrow-" + (showItem === 'item_04' ? "dropdown" : "dropright")}
                size={32}
                style={styles.iconToggle}
                color={Colors.iconDefault}
              />
              <Text style={styles.subTitle}>More Information</Text>
            </View>
          </TouchableOpacity>

          {showItem === 'item_04' && (
            <Text style={styles.text}>
              To help protect your confidentiality, we will only ask you to
              provide information necessary to meet the aims of this study. Any
              information collected by computer or smart phone will be
              transmitted in a secure and confidential manner. A confidential
              number will be assigned to the information you provide, so that
              confidential information cannot be linked to you personally. If we
              write a report or article about this study or share the study data
              set with others, we will do so in such a way that you cannot be
              directly identified.
            </Text>
          )}
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name="md-information-circle"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>
            Will My Health Information be Used During this Study?
          </Text>
          <Text style={styles.text}>
            The Federal Health Insurance Portability and Accountability Act
            (HIPAA) requires your healthcare provider to obtain your permission
            for the research team to access or create “protected health
            information” about you for purposes of this research study. Once
            your healthcare provider has disclosed your protected health
            information to us, it may no longer be protected by the Federal
            HIPAA privacy regulations, but we will continue to protect your
            confidentiality as described under “Confidentiality.”
          </Text>
          <TouchableOpacity onPress={() => this.setShowItem('item_05')}>
            <View style={styles.toggleContainer}>
              <Ionicons
                name={"md-arrow-" + (showItem === 'item_05' ? "dropdown" : "dropright")}
                size={32}
                style={styles.iconToggle}
                color={Colors.iconDefault}
              />
              <Text style={styles.subTitle}>More Information</Text>
            </View>
          </TouchableOpacity>

          {showItem === 'item_05' && (
            <View>
              <Text style={styles.text}>
                We may share your health information related to this study with
                other parties including federal government regulatory agencies,
                the University of Iowa Institutional Review Boards and support
                staff, and research collaborators.
              </Text>
              <Text style={styles.text}>
                You cannot participate in this study unless you permit us to use
                your protected health information. If you choose not to allow us
                to use your protected health information, we will discuss any
                non-research alternatives available to you. Your decision will
                not affect your right to medical care that is not
                research-related. Your signature on this Consent Document
                authorizes your healthcare provider to give us permission to use
                or create health information about you.
              </Text>
              <Text style={styles.text}>
                Although you may not be allowed to see study information until
                after this study is over, you may be given access to your health
                care records by contacting your health care provider. Your
                permission for us to access or create protected health
                information about you for purposes of this study has no
                expiration date. You may withdraw your permission for us to use
                your health information for this research study by sending a
                written notice to Dr. Lane Strathearn, 100 Hawkins Dr, CDD, Iowa
                City IA. However, we may still use your health information that
                was collected before withdrawing your permission. Also, if we
                have sent your health information to a third party, such as the
                study sponsor, or we have removed your identifying information,
                it may not be possible to prevent its future use. You will
                receive a copy of this signed document.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name="md-thumbs-up"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>Is Being in this Study Voluntary?</Text>
          <Text style={styles.text}>
            Taking part in this research study is completely voluntary. You may
            choose not to take part at all. If you decide to be in this study,
            you may stop participating at any time. If you decide not to be in
            this study, or if you stop participating at any time, you won’t be
            penalized or lose any benefits for which you otherwise qualify.
          </Text>
        </View>

        <View style={styles.elevated}>
          <Ionicons
            name="md-help"
            size={28}
            style={styles.icon}
            color={Colors.iconDefault}
          />
          <Text style={styles.header}>What if I have Questions</Text>
          <Text style={styles.text}>
            We encourage you to ask questions. If you have any questions about
            the research study itself, please contact: Lane Strathearn (319 356
            7044).
          </Text>
          <Text style={styles.text}>
            If you have questions, concerns, or complaints about your rights as
            a research subject or about research related injury, please contact
            the Human Subjects Office, 105 Hardin Library for the Health
            Sciences, 600 Newton Rd, The University of Iowa, Iowa City, IA
            52242-1098, (319) 335-6564, or e-mail irb@uiowa.edu. General
            information about being a research subject can be found by clicking
            “Info for Public” on the Human Subjects Office web site,
            http://hso.research.uiowa.edu/. To offer input about your
            experiences as a research subject or to speak to someone other than
            the research staff, call the Human Subjects Office at the number
            above.
          </Text>
          <Text style={styles.text}>
            This Informed Consent Document is not a contract. It is a written
            explanation of what will happen during the study if you decide to
            participate. You are not waiving any legal rights by signing this
            Informed Consent Document. Your signature indicates that this
            research study has been explained to you, that your questions have
            been answered, and that you agree to take part in this study. You
            will receive a copy of this form.
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
    marginTop: 5,
  },
  header: {
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  subTitle: {
    fontWeight: '600',
    padding: 5,
  },
  text: {
    //textAlign: 'center',
    fontSize: 12,
    padding: 5,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: '600',
  },
  textError: {
    textAlign: 'center',
    color: Colors.errorColor,
    fontSize: 11,
    padding: 5,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  bullet: {
    fontSize: 18,
    marginTop: -3,
  },
  listText: {
    fontSize: 12,
    paddingLeft: 5,
  },
  elevated: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingRight: 5,
    paddingLeft: 5,
    paddingBottom: 10,
    marginBottom: 20,
    elevation: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
  },
});

const mapStateToProps = ({ session, registration }) => ({
  session,
  registration,
});

export default connect(mapStateToProps)(ConsentDisclosureContent002);
