sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'cvx/poc/diagnosis/test/integration/FirstJourney',
		'cvx/poc/diagnosis/test/integration/pages/DiagnosisList',
		'cvx/poc/diagnosis/test/integration/pages/DiagnosisObjectPage'
    ],
    function(JourneyRunner, opaJourney, DiagnosisList, DiagnosisObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('cvx/poc/diagnosis') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheDiagnosisList: DiagnosisList,
					onTheDiagnosisObjectPage: DiagnosisObjectPage
                }
            },
            opaJourney.run
        );
    }
);