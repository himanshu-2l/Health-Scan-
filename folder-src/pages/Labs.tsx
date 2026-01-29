import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassNavbar } from '@/components/GlassNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import { Activity, Eye, Mic, ArrowRight, Stethoscope, Shield, Heart, Brain, Ear } from 'lucide-react';

const labs = [
	{
		id: 'motor',
		title: 'Motor & Tremor Lab',
		description: 'Measure movement patterns, tremor frequency, and motor control',
		icon: Activity,
		status: 'ready',
		features: ['Finger Tapping', 'Tremor Analysis', 'Movement Speed', 'Coordination'],
		color: 'blue'
	},
	{
		id: 'voice',
		title: 'Voice & Speech Lab',
		description: 'Analyze vocal patterns, pitch stability, and speech characteristics',
		icon: Mic,
		status: 'ready',
		features: ['Pitch Analysis', 'Jitter Detection', 'Voice Quality', 'Speech Patterns'],
		color: 'green'
	},
	{
		id: 'eye',
		title: 'Eye & Cognition Lab',
		description: 'Test reaction times, visual attention, and cognitive processing',
		icon: Eye,
		status: 'ready',
		features: ['Saccade Tests', 'Reaction Time', 'Stroop Test', 'Visual Attention'],
		color: 'orange'
	},
	{
		id: 'mental-health',
		title: 'Mental Health Lab',
		description: 'PHQ-9 depression and GAD-7 anxiety screening assessments',
		icon: Brain,
		status: 'ready',
		features: ['PHQ-9 Screening', 'GAD-7 Screening', 'Stress Assessment', 'Mood Tracking'],
		color: 'purple'
	},
	{
		id: 'vision-hearing',
		title: 'Vision & Hearing Lab',
		description: 'Visual acuity, color blindness, and hearing frequency tests',
		icon: Ear,
		status: 'ready',
		features: ['Visual Acuity', 'Color Blindness', 'Hearing Test', 'Peripheral Vision'],
		color: 'indigo'
	},
];

const LabsPage = () => {
	const location = useLocation();
	const isLabDetail = location.pathname.split('/').length > 2;

	if (isLabDetail) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
				<GlassNavbar showBack />
				<main className="container mx-auto px-4 py-8 pt-24">
					<Outlet />
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 flex flex-col">
			<GlassNavbar />
			<main className="container mx-auto px-6 py-12 pt-24 flex-1">
				<div className="text-center mb-12 bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-600">
					<div className="flex items-center justify-center gap-3 mb-4">
						<Stethoscope className="w-10 h-10 text-blue-600" />
						<Shield className="w-10 h-10 text-green-600" />
					</div>
					<h1 className="text-5xl font-bold text-gray-900">
						Health Scan Bench
					</h1>
					<p className="text-xl text-gray-600 mt-4">Select a lab to begin your session.</p>
					<div className="flex justify-center gap-2 mt-4">
						<Badge className="bg-blue-600 text-white">ABDM Integrated</Badge>
						<Badge className="bg-green-600 text-white">Government Approved</Badge>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
					{labs.map((lab) => {
						const IconComponent = lab.icon;
						const colorClasses = {
							blue: 'border-blue-600 text-blue-600 bg-blue-50',
							green: 'border-green-600 text-green-600 bg-green-50',
							orange: 'border-orange-600 text-orange-600 bg-orange-50'
						};
						return (
							<Link to={`/labs/${lab.id}`} key={lab.id}>
								<Card className={`bg-white shadow-md group cursor-pointer hover:shadow-lg transition-all duration-300 border-l-4 ${colorClasses[lab.color as keyof typeof colorClasses]}`}>
									<CardHeader className="pb-6">
										<div className="flex items-center justify-between mb-4">
											<div className={`p-3 rounded-2xl ${colorClasses[lab.color as keyof typeof colorClasses]}`}>
												<IconComponent className={`w-10 h-10 ${lab.color === 'blue' ? 'text-blue-600' : lab.color === 'green' ? 'text-green-600' : 'text-orange-600'}`} />
											</div>
											<Badge className="bg-green-100 text-green-700 border-green-300 text-sm px-3 py-1">
												{lab.status}
											</Badge>
										</div>
										<CardTitle className="group-hover:text-blue-600 transition-colors text-2xl text-gray-900">
											{lab.title}
										</CardTitle>
										<CardDescription className="text-lg leading-relaxed text-gray-600">
											{lab.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="bg-white">
										<div className="space-y-4">
											<div className="flex flex-wrap gap-2">
												{lab.features.map((feature) => (
													<Badge
														key={feature}
														variant="outline"
														className="text-sm px-3 py-1 border-gray-300 text-gray-700 bg-gray-50"
													>
														{feature}
													</Badge>
												))}
											</div>
											<Button
												className={`w-full ${lab.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : lab.color === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'} text-white`}
												size="lg"
											>
												Launch Lab
												<ArrowRight className="ml-2 h-5 w-5" />
											</Button>
										</div>
									</CardContent>
								</Card>
							</Link>
						);
					})}
				</div>
			</main>
			<SiteFooter />
		</div>
	);
};

export default LabsPage;
