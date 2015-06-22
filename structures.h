struct String {
	char body[100];
	int length;
};

union Data {
	int number;
	struct String string;
};

struct Value {
	union Data data;
	char type;
	char label[20];
};
