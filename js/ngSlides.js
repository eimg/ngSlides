var app = angular.module('ngSlides', []);

app.controller("SlideController", function ($scope, $location, datastore) {
	$scope.slides = datastore.get();
	$scope.activeSlide = 0;

	$scope.$watch('slides', function (newValue, oldValue) {
		if (newValue !== oldValue) {
			datastore.put($scope.slides);
		}
	}, true);
	 
	$scope.addSlide = function() {
		if(!$scope.slideTitle && !$scope.slideBody) {
			return false;
		}

		$scope.hideAll();
		$scope.activeSlide = $scope.slides.length;

		$scope.slides.push({
			title: $scope.slideTitle,
			body: $scope.slideBody,
			state: 'show'
		});

		$scope.slideTitle = '';
		$scope.slideBody = '';
	};

	$scope.removeSlide = function(slide) {
		var index = $scope.slides.indexOf(slide);
		$scope.slides.splice(index, 1);
		$scope.next();
	};

	$scope.hideAll = function() {
		angular.forEach($scope.slides, function(slide) {
			slide.state = 'hide';
		});
	};

	$scope.next = function() {
		var next = $scope.activeSlide + 1;
		if(next >= $scope.slides.length) next = 0;
		$scope.activeSlide = next;

		$scope.hideAll();
		$scope.slides[next].state = 'show';
	};

	$scope.previous = function() {
		var prev = $scope.activeSlide - 1;
		if(prev < 0) prev = $scope.slides.length - 1;
		$scope.activeSlide = prev;

		$scope.hideAll();
		$scope.slides[prev].state = 'show';
	};
});

app.directive("next", function() {
	return {
		restrict: "E",
		template: '<a href="#" class="next">Next &raquo;</a>',
		link: function(scope, element) {
			element.bind('click', function() {
				scope.$apply("next()");
			});
		}
	}
});

app.directive("previous", function() {
	return {
		restrict: "E",
		template: '<a href="#" class="previous">&laquo; Previous</a>',
		link: function(scope, element) {
			element.bind('click', function() {
				scope.$apply("previous()");
			});
		}
	}
});

app.factory('datastore', function () {
	var STORAGE_ID = 'ngSlides';

	return {
		get: function () {
			return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
		},

		put: function (slides) {
			localStorage.setItem(STORAGE_ID, JSON.stringify(slides));
		}
	};
});
